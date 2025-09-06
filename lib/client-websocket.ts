import { io, Socket } from 'socket.io-client'
import { getAuthToken } from './client-auth'

let socket: Socket | null = null

export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null
  
  if (!socket) {
    const token = getAuthToken()
    if (!token) return null
    
    socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
