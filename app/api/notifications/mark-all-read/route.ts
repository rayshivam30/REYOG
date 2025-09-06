import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { markAllAsRead } from '@/lib/notifications'

export async function POST() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await markAllAsRead(user.userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
