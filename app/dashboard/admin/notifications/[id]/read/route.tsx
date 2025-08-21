// app/api/notifications/[id]/read/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notificationId = params.id

    // Update the notification only if it belongs to the authenticated user
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: user.id, // Security check
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}