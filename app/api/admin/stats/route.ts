// app/api/admin/stats/route.ts

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

    // Use a transaction for efficiency to get all counts in one DB roundtrip
    const [totalQueries, pendingQueries, totalComplaints, activeUsers, totalPanchayats] = await prisma.$transaction([
      prisma.query.count(),
      prisma.query.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.complaint.count(),
      prisma.user.count(),
      prisma.panchayat.count(),
    ])

    // Fetch the 5 most recent system-wide notifications
    const recentNotifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    // Combine all stats into a single response object
    const stats = {
      totalQueries,
      pendingQueries,
      totalComplaints,
      activeUsers,
      totalPanchayats,
      recentNotifications: recentNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        // --- UPDATE: Modified the date formatting options here ---
        time: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(n.createdAt),
        type: n.type,
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch admin statistics" } },
      { status: 500 }
    )
  }
}