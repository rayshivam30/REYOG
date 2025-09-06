'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { io, type Socket } from 'socket.io-client'
import { getAuthToken } from '@/lib/client-auth'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
})

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connectWebSocket = useCallback(async () => {
    const token = getAuthToken()
    if (!token) return

    // Only connect in production or if explicitly enabled in development
    if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_WEBSOCKET_ENABLED !== 'true') {
      return
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
    })

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error.message)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    connectWebSocket()

    return () => {
      socket?.disconnect()
    }
  }, [connectWebSocket, socket])

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}
