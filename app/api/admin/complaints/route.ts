// app/api/admin/complaints/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Ensure the user is an Admin
    const userRole = request.headers.get("x-user-role") as UserRole
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 })
    }

    const complaints = await prisma.complaint.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            // Include the related panchayat data for the user
            panchayat: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Show the newest complaints first
      },
    })

    return NextResponse.json(complaints)
  } catch (error) {
    console.error("Complaints fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch complaints" } },
      { status: 500 }
    )
  }
}