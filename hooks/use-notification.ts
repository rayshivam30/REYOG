'use client'

import { useCallback } from 'react'
import { useWebSocket } from '@/contexts/websocket-context'
import { createNotification } from '@/lib/notifications'

export function useNotification() {
  const { socket, isConnected } = useWebSocket()

  const sendNotification = useCallback(async ({
    userId,
    title,
    message,
    type = 'INFO',
    queryId,
    metadata,
    relatedUserId,
  }: {
    userId: string
    title: string
    message: string
    type?: string
    queryId?: string
    metadata?: Record<string, any>
    relatedUserId?: string
  }) => {
    try {
      // First, create the notification in the database
      const notification = await createNotification({
        userId,
        title,
        message,
        type,
        queryId,
        metadata,
        relatedUserId,
      })

      // Then, emit the notification via WebSocket if connected
      if (isConnected && socket) {
        socket.emit('new-notification', notification)
      }

      return notification
    } catch (error) {
      console.error('Failed to send notification:', error)
      throw error
    }
  }, [isConnected, socket])

  return { sendNotification }
}
