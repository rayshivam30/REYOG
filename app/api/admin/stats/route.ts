import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Ensure the user is an Admin
    const userRole = request.headers.get("x-user-role") as UserRole
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required" } }, 
        { status: 403 }
      )
    }

    // Get all counts in a single transaction for consistency
    const [
      totalQueries, 
      pendingQueries, 
      totalComplaints, 
      activeUsers, 
      totalPanchayats
    ] = await prisma.$transaction([
      prisma.query.count(),
      prisma.query.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.complaint.count(),
      prisma.user.count({ where: { role: { not: UserRole.ADMIN } } }),
      prisma.panchayat.count()
    ])

    // Get recent notifications
    const recentNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        createdAt: true
      }
    })

    // Format the response
    const stats = {
      totalQueries,
      pendingQueries,
      totalComplaints,
      activeUsers,
      totalPanchayats, // This will be used in the admin dashboard
      recentNotifications: recentNotifications.map((n) => ({
        id: n.id,
        title: n.title || "Notification",
        message: n.message || "",
        time: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(n.createdAt),
        type: n.type || "INFO",
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats fetch error:", error)
    return NextResponse.json(
      { 
        error: { 
          code: "INTERNAL_ERROR", 
          message: "Failed to fetch admin statistics" 
        } 
      }, 
      { status: 500 }
    )
  }
}
