import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getAuthUser } from '@/lib/auth';
import type { NextRequest as NextReq } from 'next/server';

type RouteParams = {
  params: {
    id: string;
  };
};

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

    // Check if already upvoted
    const existingUpvote = await prisma.queryUpvote.findFirst({
      where: {
        userId: userId,
        queryId: queryId
      }
    });

    // Get current upvote count
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { upvoteCount: true }
    });

    return NextResponse.json({ 
      success: true, 
      isUpvoted: !!existingUpvote,
      upvoteCount: query?.upvoteCount || 0
    });
  } catch (error) {
    console.error('Error fetching upvote status:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch upvote status' }), 
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
    const { upvote } = await request.json();
    
    const user = await getAuthUser();
    if (!user?.userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const userId = user.userId;

    // Check if already upvoted
    const existingUpvote = await prisma.queryUpvote.findFirst({
      where: {
        userId: userId,
        queryId: queryId
      }
    });
    
    let upvoteCount = 0;
    let isUpvoted = false;
    
    if (upvote && !existingUpvote) {
      // Add upvote
      const result = await prisma.$transaction([
        prisma.queryUpvote.create({
          data: {
            userId: userId,
            queryId: queryId
          }
        }),
        prisma.query.update({
          where: { id: queryId },
          data: {
            upvoteCount: {
              increment: 1
            }
          },
          include: {
            upvotes: true
          }
        })
      ]);
      
      const updatedQuery = result[1];
      isUpvoted = true;
      upvoteCount = updatedQuery.upvoteCount;
      
      // Check if we've reached the threshold of 3 upvotes
      if (upvoteCount >= 1 && !updatedQuery.hasReachedThreshold) {
        await prisma.query.update({
          where: { id: queryId },
          data: {
            hasReachedThreshold: true
          }
        });
      }
    } else if (!upvote && existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.queryUpvote.deleteMany({
          where: {
            userId: userId,
            queryId: queryId
          }
        }),
        prisma.query.update({
          where: { id: queryId },
          data: {
            upvoteCount: {
              decrement: 1
            }
          }
        })
      ]);
      isUpvoted = false;
    }
    
    // Get current state
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { upvoteCount: true }
    });
    
    upvoteCount = Math.max(0, query?.upvoteCount || 0);
    
    return NextResponse.json({ 
      success: true, 
      isUpvoted,
      upvoteCount
    });
  } catch (error) {
    console.error("Upvote error:", error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      // Prisma's unique constraint violation error code
      if ('code' in error && error.code === 'P2002') {
        return NextResponse.json(
          { error: { code: "CONFLICT", message: "You have already upvoted this query" } },
          { status: 409 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: { 
          code: "INTERNAL_ERROR", 
          message: "An error occurred while processing your request" 
        } 
      },
      { status: 500 }
    );
  }
}
