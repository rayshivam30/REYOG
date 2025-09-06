// Using session-based authentication via cookies

export async function fetchUnreadCount(): Promise<number> {
  // Session is automatically handled via cookies

  try {
    const response = await fetch('/api/notifications/unread-count', {
      credentials: 'include' // This ensures cookies are sent with the request
    })

    if (!response.ok) {
      throw new Error('Failed to fetch unread count')
    }

    const data = await response.json()
    return data.count || 0
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  // Session is handled via cookies

  try {
    const response = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ notificationId })
    })

    if (!response.ok) {
      throw new Error('Failed to mark notification as read')
    }

    return true
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  // Session is handled via cookies

  try {
    const response = await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read')
    }

    return true
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
}
