import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserUnreadCount } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let count: number;
    if (user.role === 'ADMIN') {
      // For admins, get count of all unread admin-relevant notifications
      count = await prisma.notification.count({
        where: {
          isRead: false,
          OR: [
            { type: 'ADMIN' },
            { type: 'SYSTEM' },
            { type: 'QUERY_UPDATE' },
            { type: 'COMPLAINT_UPDATE' },
            { type: 'ASSIGNMENT' }
          ]
        }
      });
    } else {
      // For regular users, get their personal unread count
      count = await getUserUnreadCount(user.userId);
    }
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error getting unread count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
