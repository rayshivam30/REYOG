import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

export async function GET(request: NextRequest) {
  try {
    // Get the session from cookies
    const session = await getAuthUser()
    
    if (!session) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(MAX_LIMIT, parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString()))
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const type = searchParams.get("type")

    const isAdmin = session.role === 'ADMIN';
    
    const where = {
      // For admins, don't filter by userId to see all notifications
      // For regular users, only show their own notifications
      ...(isAdmin ? {} : { userId: session.userId }),
      ...(unreadOnly && { isRead: false }),
      ...(type && { type }),
      // For admins, filter by admin-relevant notification types
      ...(isAdmin && !type ? {
        OR: [
          { type: 'ADMIN' },
          { type: 'SYSTEM' },
          { type: 'QUERY_UPDATE' },
          { type: 'COMPLAINT_UPDATE' },
          { type: 'ASSIGNMENT' }
        ]
      } : {})
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          query: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ])

    const hasMore = page * limit < total
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch notifications" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      userId = user.id, 
      title, 
      message, 
      type = "INFO", 
      queryId,
      metadata,
      relatedUserId 
    } = body

    // Only allow admins to create notifications for other users
    if (userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions" } }, 
        { status: 403 }
      )
    }

    // Validate notification type
    const validTypes = [
      'INFO', 'SUCCESS', 'WARNING', 'ERROR', 
      'QUERY_UPDATE', 'COMMENT', 'LIKE', 
      'SHARE', 'RETWEET', 'MENTION', 'SYSTEM'
    ]
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Invalid notification type" } }, 
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        queryId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        relatedUserId,
      },
      include: {
        query: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create notification" } },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get("olderThan")
    const type = searchParams.get("type")

    const where: any = {
      userId: user.id,
      ...(type && { type }),
    }

    if (olderThan) {
      try {
        const date = new Date(olderThan)
        if (!isNaN(date.getTime())) {
          where.createdAt = {
            lt: date,
          }
        }
      } catch (e) {
        console.error("Invalid date format:", olderThan)
      }
    }

    const { count } = await prisma.notification.deleteMany({
      where,
    })

    return NextResponse.json({
      success: true,
      count,
    })
  } catch (error) {
    console.error("Error deleting notifications:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete notifications" } },
      { status: 500 },
    )
  }
}
