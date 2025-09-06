'use client'

import { useWebSocket } from '@/contexts/websocket-context'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Bell, MessageSquare, ThumbsUp, Share2, AtSign } from 'lucide-react'

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
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

export function NotificationToast() {
  const { socket } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleNewNotification = (notification: any) => {
      toast(
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="grid gap-1">
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            {notification.metadata?.details && (
              <p className="mt-1 text-xs text-muted-foreground">
                {notification.metadata.details}
              </p>
            )}
          </div>
        </div>,
        {
          duration: 5000,
          position: 'bottom-right',
          className: 'w-[350px]',
        }
      )
    }

    socket.on('new-notification', handleNewNotification)

    return () => {
      socket.off('new-notification', handleNewNotification)
    }
  }, [socket])

  return null
}
