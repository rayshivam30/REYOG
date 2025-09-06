import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notificationTriggers } from '@/lib/notification-triggers';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const queryId = (await params).id;

    // Update the share count
    const query = await prisma.query.update({
      where: { id: queryId },
      data: {
        shareCount: {
          increment: 1
        }
      },
      select: {
        id: true,
        title: true,
        userId: true
      }
    });

    // Trigger notification for the share
    try {
      await notificationTriggers.onQueryShared(queryId, user.userId);
    } catch (error) {
      console.error('Error triggering share notification:', error);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Shared successfully',
      shareCount: query.shareCount
    });
  } catch (error) {
    console.error('Error updating share count:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update share count' }), { status: 500 });
  }
}
