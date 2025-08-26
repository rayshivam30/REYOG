import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { retweet } = await request.json();
    const queryId = params.id;

    // If this is a retweet, create a new query
    if (retweet) {
      const originalQuery = await prisma.query.findUnique({
        where: { id: queryId },
        include: { user: true }
      });

      if (originalQuery) {
        await prisma.query.create({
          data: {
            title: `Retweet: ${originalQuery.title}`,
            description: `${originalQuery.description}\n\n[Retweet of query #${queryId}]`,
            status: 'PENDING_REVIEW',
            userId: (user as any).id, // Type assertion to handle JWT payload
            panchayatId: (user as any).panchayatId,
            departmentId: originalQuery.departmentId,
            officeId: originalQuery.officeId,
          }
        });
      }
    }

    // Count retweets by checking for queries that reference this one in their description
    const retweetCount = await prisma.query.count({
      where: {
        description: {
          contains: `[Retweet of query #${queryId}]`
        }
      },
    });

    return NextResponse.json({ success: true, retweetCount });
  } catch (error) {
    console.error('Error updating retweet:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update retweet' }), { status: 500 });
  }
}
