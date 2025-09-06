'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Check, X, Clock, AlertCircle, CheckCircle, MessageSquare, ThumbsUp, Share2, AtSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { getSocket } from '@/lib/client-websocket'
import { parseJwt, getAuthToken } from '@/lib/client-auth'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/components/providers/notification-provider'
import { markNotificationAsRead } from '@/lib/client-notifications'

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

export function NotificationList() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const { markAllNotificationsAsRead } = useNotifications()
  const limit = 10

  const queryClient = useQueryClient()
  
  const { data: notificationsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications', page],
    queryFn: async () => {
      const token = getAuthToken()
      if (!token) return { notifications: [], pagination: { hasMore: false } }
      
      const response = await fetch(`/api/notifications?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch notifications')
      return await response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleConnect = () => {
      console.log('Connected to WebSocket')
    }

    const handleNewNotification = (notification: any) => {
      setNotifications(prev => [notification, ...prev])
      
      // Play a sound for new notifications
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        })
      }
    }

    const handleNotificationRead = (notificationId: string) => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
    }

    socket.on('connect', handleConnect)
    socket.on('new-notification', handleNewNotification)
    socket.on('notification-read', handleNotificationRead)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('new-notification', handleNewNotification)
      socket.off('notification-read', handleNotificationRead)
    }
  }, [])

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id)
      }
      
      if (notification.queryId) {
        router.push(`/queries/${notification.queryId}`)
      }
    } catch (error) {
      console.error('Error handling notification click:', error)
    }
  }

  if (isLoading && notifications.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading notifications
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load notifications. Please try again.</p>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
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
            className={`rounded-lg border p-4 transition-colors hover:bg-gray-50 cursor-pointer ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
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

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
