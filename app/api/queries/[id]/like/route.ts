import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

interface LikeRequest {
  like: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user?.userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Await the params object
    const { id: queryId } = await params;
    const userId = user.userId;

    // Check if already liked
    const existingLike = await prisma.queryLike.findFirst({
      where: {
        userId: userId,
        queryId: queryId
      }
    });

    // Get current like count
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { likeCount: true }
    });

    return NextResponse.json({ 
      success: true, 
      isLiked: !!existingLike,
      likeCount: query?.likeCount || 0
    });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch like status' }), 
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object
    const { id: queryId } = await params;
    const { like } = await request.json() as LikeRequest;
    
    const user = await getAuthUser();
    if (!user?.userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const userId = user.userId;
    
    // Check if already liked
    const existingLike = await prisma.queryLike.findFirst({
      where: {
        userId: userId,
        queryId: queryId
      }
    });
    
    let likeCount = 0;
    let isLiked = false;
    
    if (like && !existingLike) {
      // Add like
      await prisma.$transaction([
        prisma.queryLike.create({
          data: {
            userId: userId,
            queryId: queryId
          }
        }),
        prisma.query.update({
          where: { id: queryId },
          data: {
            likeCount: {
              increment: 1
            }
          }
        })
      ]);
      isLiked = true;
    } else if (!like && existingLike) {
      // Remove like
      await prisma.$transaction([
        prisma.queryLike.deleteMany({
          where: {
            userId: userId,
            queryId: queryId
          }
        }),
        prisma.query.update({
          where: { id: queryId },
          data: {
            likeCount: {
              decrement: 1
            }
          }
        })
      ]);
      isLiked = false;
    }
    
    // Get current state
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { likeCount: true }
    });
    
    likeCount = Math.max(0, query?.likeCount || 0);
    
    return NextResponse.json({ 
      success: true, 
      isLiked,
      likeCount
    });
  } catch (error) {
    console.error('Error updating like:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to update like',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
}
