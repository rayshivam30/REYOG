import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role") as UserRole;
    
    // Check for user authentication and role
    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can upvote queries" } },
        { status: 403 }
      );
    }
    
    // Use the id from params
    const queryId = params.id;

    // Check if the query exists
    const existingQuery = await prisma.query.findUnique({
      where: { id: queryId },
    });
    
    if (!existingQuery) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Query not found" } }, { status: 404 });
    }

    try {
      // Create a new upvote record in the database
      await prisma.queryUpvote.create({
        data: {
          queryId,
          userId,
        },
      });
      
      // If the creation is successful, increment the upvote count on the query
      await prisma.query.update({
        where: { id: queryId },
        data: {
          upvoteCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: "Upvote successful" });

    } catch (e: any) {
      // Handle the unique constraint error if the user has already upvoted
      if (e.code === 'P2002') { // Prisma's unique constraint violation error code
        return NextResponse.json(
          { error: { code: "CONFLICT", message: "You have already upvoted this query" } },
          { status: 409 }
        );
      }
      // Re-throw other errors for the outer catch block to handle
      throw e;
    }
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while processing your request" } },
      { status: 500 }
    );
  }
}
