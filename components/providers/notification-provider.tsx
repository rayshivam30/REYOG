'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { fetchUnreadCount, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/client-notifications'

interface NotificationContextType {
  unreadCount: number
  isLoading: boolean
  refreshNotifications: () => Promise<number>
  markNotificationAsRead: (id: string) => Promise<boolean>
  markAllNotificationsAsRead: () => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadCount()
      setUnreadCount(count)
      return count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUnreadCount()
  }, [refreshUnreadCount])

  const refreshNotifications = useCallback(async () => {
    return refreshUnreadCount()
  }, [refreshUnreadCount])

  const handleMarkAsRead = useCallback(async (id: string): Promise<boolean> => {
    const success = await markNotificationAsRead(id)
    if (success) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    return success
  }, [])

  const handleMarkAllAsRead = useCallback(async (): Promise<boolean> => {
    const success = await markAllNotificationsAsRead()
    if (success) {
      setUnreadCount(0)
    }
    return success
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        isLoading,
        refreshNotifications,
        markNotificationAsRead: handleMarkAsRead,
        markAllNotificationsAsRead: handleMarkAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Export the NotificationBell component from its new location
export { NotificationBell } from '@/components/ui/notification-bell'