import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Temporary type to handle Prisma client extension
type PrismaClientWithModels = typeof prisma & {
  comment: any; // Temporary any type to bypass type checking
};

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id: queryId } = await Promise.resolve(context.params);
    const user = await getAuthUser();
    if (!user || !user.userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { content } = await request.json();

    // Type assertion to bypass TypeScript errors
    const prismaClient = prisma as unknown as PrismaClientWithModels;
    
    // First, verify the query exists
    const queryExists = await prisma.query.findUnique({
      where: { id: queryId }
    });

    if (!queryExists) {
      return new NextResponse(JSON.stringify({ error: 'Query not found' }), { status: 404 });
    }
    
    // Create a new comment
    const comment = await prismaClient.comment.create({
      data: {
        content,
        query: {
          connect: { id: queryId }
        },
        user: {
          connect: { id: user.userId }
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
      UPDATE queries 
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
  context: { params: { id: string } }
) {
  try {
    const { id: queryId } = await Promise.resolve(context.params);

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
