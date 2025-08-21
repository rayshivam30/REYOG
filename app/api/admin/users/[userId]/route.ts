// File: app/api/admin/users/[userId]/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUserFromRequest } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const adminUser = await getAuthUserFromRequest(request)
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId } = params

    // Optional: Prevent admin from deleting themselves
    if (adminUser.userId === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}