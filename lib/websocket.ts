import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { verifyToken } from './auth'
import { prisma } from './prisma'

let io: Server | null = null

interface AuthenticatedSocket extends Socket {
  userId?: string
}

export function initializeWebSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const user = await verifyToken(token)
      if (!user) {
        return next(new Error('Authentication error: Invalid token'))
      }

      socket.userId = user.userId
      next()
    } catch (error) {
      next(new Error('Authentication error: ' + (error as Error).message))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) return

    console.log(`User ${socket.userId} connected to WebSocket`)

    // Join a room for this user to receive personal notifications
    socket.join(`user:${socket.userId}`)

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from WebSocket`)
    })
  })

  return io
}

export function getIO() {
  if (!io) {
    throw new Error('WebSocket server not initialized')
  }
  return io
}

export async function sendNotification(notification: any) {
  const io = getIO()
  
  // Emit to the specific user
  io.to(`user:${notification.userId}`).emit('new-notification', notification)
  
  // If it's related to a query, also notify users watching that query
  if (notification.queryId) {
    // Get users watching this query (e.g., participants, assignees, etc.)
    const watchers = await prisma.query.findUnique({
      where: { id: notification.queryId },
      select: {
        user: { select: { id: true } },
        assignedOffices: {
          select: { office: { select: { users: { select: { id: true } } } } },
        },
        assignedNgos: {
          select: { ngo: { select: { users: { select: { id: true } } } } },
        },
      },
    })

    if (watchers) {
      const userIds = new Set<string>()
      
      // Add query creator
      if (watchers.user) {
        userIds.add(watchers.user.id)
      }
      
      // Add assigned office users
      watchers.assignedOffices.forEach(({ office }) => {
        office.users.forEach((user: { id: string }) => {
          if (user.id !== notification.userId) {
            userIds.add(user.id)
          }
        })
      })
      
      // Add assigned NGO users
      watchers.assignedNgos.forEach(({ ngo }) => {
        ngo.users.forEach((user: { id: string }) => {
          if (user.id !== notification.userId) {
            userIds.add(user.id)
          }
        })
      })
      
      // Send to all watchers
      userIds.forEach(userId => {
        io.to(`user:${userId}`).emit('new-notification', notification)
      })
    }
  }
}

export async function notifyNotificationRead(notificationId: string, userId: string) {
  const io = getIO()
  io.to(`user:${userId}`).emit('notification-read', notificationId)
}
