// app/api/admin/panchayats/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { verifyToken } from "@/lib/auth" // Or your header-based auth

export async function GET(request: NextRequest) {
  try {
    // Add the same admin check as your other routes
    const user = await verifyToken(request)
    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const panchayats = await prisma.panchayat.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ panchayats })
  } catch (error) {
    console.error("Failed to fetch panchayats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}