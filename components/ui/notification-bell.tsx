'use client'

import { useState, useEffect } from 'react'
import { Bell, Loader2, Check } from 'lucide-react'
import { useNotifications } from '../providers/notification-provider'
import { Button } from './button'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const { unreadCount, isLoading, markNotificationAsRead, markAllNotificationsAsRead, refreshNotifications } = useNotifications()
  
  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true)
      
      // The token is automatically sent via cookies in the fetch request
      const response = await fetch('/api/notifications', {
        credentials: 'include' // This ensures cookies are sent with the request
      })
      
      if (response.status === 401) {
        // If unauthorized, redirect to login
        window.location.href = '/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname)
        return
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Failed to fetch notifications')
      }
      
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to load notifications')
    } finally {
      setIsLoadingNotifications(false)
    }
  }
  
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])
  
  if (isLoading) {
    return (
      <div className="p-2">
        <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute left-8 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto border border-gray-200">
          <div className="p-2 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={async () => {
                    try {
                      await markAllNotificationsAsRead()
                      await refreshNotifications()
                      toast.success('Marked all as read')
                    } catch (error) {
                      toast.error('Failed to mark all as read')
                    }
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          
          {isLoadingNotifications ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No new notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  onClick={async () => {
                    if (!notification.isRead) {
                      await markNotificationAsRead(notification.id)
                      await refreshNotifications()
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="p-2 border-t text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Navigate to notifications page
                window.location.href = '/dashboard/notifications'
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
