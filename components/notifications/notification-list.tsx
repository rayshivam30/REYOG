'use client'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Check, AlertCircle, CheckCircle, MessageSquare, ThumbsUp, Share2, AtSign, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { getSocket } from '@/lib/client-websocket'
import { getAuthToken } from '@/lib/client-auth'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/components/providers/notification-provider'

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'ERROR':
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case 'WARNING':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case 'COMMENT':
      return <MessageSquare className="h-5 w-5 text-blue-500" />
    case 'LIKE':
      return <ThumbsUp className="h-5 w-5 text-pink-500" />
    case 'SHARE':
    case 'RETWEET':
      return <Share2 className="h-5 w-5 text-purple-500" />
    case 'MENTION':
      return <AtSign className="h-5 w-5 text-indigo-500" />
    case 'QUERY_UPDATE':
      return <Bell className="h-5 w-5 text-amber-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  queryId?: string;
  createdAt: string;
  metadata?: {
    details?: string;
  };
}

export function NotificationList() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { markAllNotificationsAsRead, markNotificationAsRead } = useNotifications()
  
  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/notifications?limit=20', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized (will be handled by auth redirect)
            return { notifications: [], pagination: { hasMore: false } };
          }
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error fetching notifications:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.notifications || []);
    }
  }, [notificationsData]);

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
      
      if (Notification?.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        })
      }
    }

    const handleNotificationRead = (notificationId: string) => {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    }

    socket.on('new-notification', handleNewNotification)
    socket.on('notification-read', handleNotificationRead)

    return () => {
      socket.off('new-notification', handleNewNotification)
      socket.off('notification-read', handleNotificationRead)
    }
  }, [])

  const getBasePath = useCallback(() => {
    if (typeof window === 'undefined') return '/dashboard/voter';
    const currentPath = window.location.pathname;
    
    // Check for admin paths
    if (currentPath.startsWith('/dashboard/admin') || currentPath.includes('/admin/')) {
      return '/dashboard/admin';
    }
    // Check for panchayat paths
    if (currentPath.startsWith('/dashboard/panchayat') || currentPath.includes('/panchayat/')) {
      return '/dashboard/panchayat';
    }
    // Default to voter
    return '/dashboard/voter';
  }, []);

  const handleNotificationClick = useCallback(async (
    notification: Notification, 
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    event?.preventDefault()
    event?.stopPropagation()
    
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id)
      }
      
      if (notification.queryId) {
        const basePath = getBasePath();
        router.push(`${basePath}/queries/${notification.queryId}`)
      }
    } catch (error) {
      console.error('Error handling notification click:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to process notification'}`)
    }
  }, [markNotificationAsRead, router, getBasePath])

  if (isLoading && notifications.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start p-4 border-b">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load notifications</h3>
        <p className="text-gray-500 mb-4">There was an error loading your notifications. Please try again.</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center">
        <Bell className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have any notifications yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={markAllNotificationsAsRead}
          disabled={!notifications.some(n => !n.isRead)}
        >
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b ${
              !notification.isRead ? 'bg-blue-50' : 'bg-white'
            } hover:bg-gray-50 transition-colors cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNotificationClick(notification, e);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleNotificationClick(notification, e);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {notification.message}
                  </p>
                  {notification.metadata?.details && (
                    <p className="mt-1 text-xs text-gray-500">
                      {notification.metadata.details}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
                {!notification.isRead && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
