import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUserFromRequest } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const adminUser = await getAuthUserFromRequest(request)
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId } = params
    const body = await request.json()
    const { status } = body

    // Optional: Prevent admin from banning themselves
    if (adminUser.userId === userId) {
      return NextResponse.json({ error: "Cannot ban your own account" }, { status: 400 })
    }

    // Validate status
    if (status !== "BANNED" && status !== "ACTIVE") {
      return NextResponse.json({ error: "Invalid status. Must be 'BANNED' or 'ACTIVE'" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error("Failed to ban user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
