import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Temporary type to handle Prisma client extension
type PrismaClientWithModels = typeof prisma & {
  comment: any; // Temporary any type to bypass type checking
};

type RouteParams = {
  params: {
    id: string;
  };
};

export async function POST(
  request: Request,
  context: RouteParams
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { content } = await request.json();
    const queryId = context.params.id;

    // Type assertion to bypass TypeScript errors
    const prismaClient = prisma as unknown as PrismaClientWithModels;
    
    // Create a new comment
    const comment = await prismaClient.comment.create({
      data: {
        content,
        query: {
          connect: { id: queryId }
        },
        user: {
          connect: { id: (user as any).id }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update the comment count using a raw SQL query to avoid type issues
    await prisma.$executeRaw`
      UPDATE "Query" 
      SET "commentCount" = "commentCount" + 1
      WHERE id = ${queryId}
    `;

    // Get the updated comment count
    const commentCount = await prismaClient.comment.count({
      where: { queryId },
    });

    return NextResponse.json({ ...comment, commentCount });
  } catch (error) {
    console.error('Error creating comment:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create comment' }), { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const queryId = context.params.id;

    // Type assertion to bypass TypeScript errors
    const prismaClient = prisma as unknown as PrismaClientWithModels;
    
    const comments = await prismaClient.comment.findMany({
      where: { queryId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    const commentCount = comments.length;

    return NextResponse.json({ comments, commentCount });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch comments' }), { status: 500 });
  }
}
