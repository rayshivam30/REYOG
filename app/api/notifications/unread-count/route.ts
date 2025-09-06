import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserUnreadCount } from '@/lib/notifications'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const count = await getUserUnreadCount(user.userId)
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error getting unread count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
