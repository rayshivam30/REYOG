import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
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

    // Get the 10 most recent unread notifications
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.userId,
        isRead: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        title: true,
        message: true,
        isRead: true,
        type: true,
        queryId: true,
        relatedUserId: true,
        createdAt: true
      }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching recent notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
