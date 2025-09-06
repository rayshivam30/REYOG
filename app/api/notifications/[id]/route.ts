import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      )
    }

    const notification = await prisma.notification.update({
      where: {
        id: params.id,
        userId: user.id, // Ensure user can only update their own notifications
      },
      data: {
        isRead: true,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Notification not found" } },
        { status: 404 }
      )
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to update notification" } },
      { status: 500 }
    )
  }
}
