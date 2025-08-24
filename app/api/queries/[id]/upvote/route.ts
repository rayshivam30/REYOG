import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getAuthUser } from '@/lib/auth';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const queryId = params.id;
    const userId = (user as any).id;

    // Check if table exists, if not create it
    try {
      await prisma.$queryRaw`SELECT 1 FROM "query_upvotes" LIMIT 1`;
    } catch (error) {
      console.log('Creating query_upvotes table...');
      try {
        await prisma.$executeRaw`
          CREATE TABLE "query_upvotes" (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "queryId" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            FOREIGN KEY ("queryId") REFERENCES "queries"(id) ON DELETE CASCADE,
            FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE CASCADE,
            CONSTRAINT "query_upvotes_queryId_userId_key" UNIQUE ("queryId", "userId")
          )
        `;
        console.log('Successfully created query_upvotes table');
      } catch (createError) {
        console.error('Error creating query_upvotes table:', createError);
        throw createError;
      }
    }

    // Check if already upvoted
    const existingUpvote = await prisma.$queryRaw`
      SELECT id FROM "query_upvotes" 
      WHERE "userId" = ${userId} AND "queryId" = ${queryId} 
      LIMIT 1
    `;
    
    let upvoteCount = 0;
    
    if (!(existingUpvote as any[]).length) {
      // Add upvote
      await prisma.$transaction([
        prisma.$executeRaw`
          INSERT INTO "QueryUpvote" ("id", "userId", "queryId", "createdAt")
          VALUES (gen_random_uuid(), ${userId}, ${queryId}, NOW())
        `,
        prisma.$executeRaw`
          UPDATE "Query" 
          SET "upvoteCount" = "upvoteCount" + 1 
          WHERE "id" = ${queryId}
        `
      ]);
      
      // Get updated count
      const result = await prisma.$queryRaw`
        SELECT "upvoteCount" FROM "Query" WHERE "id" = ${queryId}
      `;
      upvoteCount = Number((result as any)[0]?.upvoteCount || 0);
    } else {
      // Remove upvote
      await prisma.$transaction([
        prisma.$executeRaw`
          DELETE FROM "QueryUpvote" 
          WHERE "userId" = ${userId} AND "queryId" = ${queryId}
        `,
        prisma.$executeRaw`
          UPDATE "Query" 
          SET "upvoteCount" = GREATEST(0, "upvoteCount" - 1)
          WHERE "id" = ${queryId}
        `
      ]);
      
      // Get updated count
      const result = await prisma.$queryRaw`
        SELECT "upvoteCount" FROM "Query" WHERE "id" = ${queryId}
      `;
      upvoteCount = Number((result as any)[0]?.upvoteCount || 0);
    }

    return NextResponse.json({ success: true, upvoteCount });
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
