import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface LikeRequest {
  like: boolean;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { like } = await request.json() as LikeRequest;
    const queryId = params.id;
    const userId = (user as any).id;
    
    // Check if table exists, if not create it
    try {
      await prisma.$queryRaw`SELECT 1 FROM "query_likes" LIMIT 1`;
    } catch (error) {
      console.log('Creating query_likes table...');
      try {
        await prisma.$executeRaw`
          CREATE TABLE "query_likes" (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "queryId" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            FOREIGN KEY ("queryId") REFERENCES "queries"(id) ON DELETE CASCADE,
            FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE CASCADE,
            CONSTRAINT "query_likes_queryId_userId_key" UNIQUE ("queryId", "userId")
          )
        `;
        console.log('Successfully created query_likes table');
      } catch (createError) {
        console.error('Error creating query_likes table:', createError);
        throw createError;
      }
    }

    // Check if already liked
    const existingLike = await prisma.$queryRaw`
      SELECT id FROM "query_likes" 
      WHERE "userId" = ${userId} AND "queryId" = ${queryId} 
      LIMIT 1
    `;
    
    let likeCount = 0;
    
    if (like && !(existingLike as any[]).length) {
      // Add like
      await prisma.$transaction([
        prisma.$executeRaw`
          INSERT INTO "QueryLike" ("id", "userId", "queryId", "createdAt")
          VALUES (gen_random_uuid(), ${userId}, ${queryId}, NOW())
        `,
        prisma.$executeRaw`
          UPDATE "Query" 
          SET "likeCount" = "likeCount" + 1 
          WHERE "id" = ${queryId}
        `
      ]);
      
      // Get updated count
      const result = await prisma.$queryRaw`
        SELECT "likeCount" FROM "Query" WHERE "id" = ${queryId}
      `;
      likeCount = Number((result as any)[0]?.likeCount || 0);
    } else if (!like && (existingLike as any[]).length) {
      // Remove like
      await prisma.$transaction([
        prisma.$executeRaw`
          DELETE FROM "QueryLike" 
          WHERE "userId" = ${userId} AND "queryId" = ${queryId}
        `,
        prisma.$executeRaw`
          UPDATE "Query" 
          SET "likeCount" = GREATEST(0, "likeCount" - 1)
          WHERE "id" = ${queryId}
        `
      ]);
      
      // Get updated count
      const result = await prisma.$queryRaw`
        SELECT "likeCount" FROM "Query" WHERE "id" = ${queryId}
      `;
      likeCount = Number((result as any)[0]?.likeCount || 0);
    } else {
      // Just get current count
      const result = await prisma.$queryRaw`
        SELECT "likeCount" FROM "Query" WHERE "id" = ${queryId}
      `;
      likeCount = Number((result as any)[0]?.likeCount || 0);
    }
    return NextResponse.json({ 
      success: true, 
      likeCount,
      isLiked: like
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
