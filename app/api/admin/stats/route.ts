// // app/api/admin/stats/route.ts

// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { UserRole } from "@prisma/client"

// export async function GET(request: NextRequest) {
//   try {
//     // Ensure the user is an Admin
//     const userRole = request.headers.get("x-user-role") as UserRole
//     if (userRole !== UserRole.ADMIN) {
//       return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 })
//     }

//     // Use a transaction for efficiency to get all counts in one DB roundtrip
//     const [totalQueries, pendingQueries, totalComplaints, activeUsers, totalPanchayats] = await prisma.$transaction([
//       prisma.query.count(),
//       prisma.query.count({ where: { status: "PENDING_REVIEW" } }),
//       prisma.complaint.count(),
//       prisma.user.count(),
//       prisma.panchayat.count(),
//     ])

//     // Fetch the 5 most recent system-wide notifications
//     const recentNotifications = await prisma.notification.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 5,
//     })

//     // Combine all stats into a single response object
//     const stats = {
//       totalQueries,
//       pendingQueries,
//       totalComplaints,
//       activeUsers,
//       totalPanchayats,
//       recentNotifications: recentNotifications.map((n) => ({
//         id: n.id,
//         title: n.title,
//         message: n.message,
//         // --- UPDATE: Modified the date formatting options here ---
//         time: new Intl.DateTimeFormat("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//         }).format(n.createdAt),
//         type: n.type,
//       })),
//     }

//     return NextResponse.json(stats)
//   } catch (error) {
//     console.error("Admin stats fetch error:", error)
//     return NextResponse.json(
//       { error: { code: "INTERNAL_ERROR", message: "Failed to fetch admin statistics" } },
//       { status: 500 }
//     )
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { UserRole } from "@prisma/client"

// export async function GET(request: NextRequest) {
//   try {
//     // Ensure the user is an Admin
//     const userRole = request.headers.get("x-user-role") as UserRole
//     if (userRole !== UserRole.ADMIN) {
//       return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 })
//     }

//     // Use a transaction for efficiency to get all counts in one DB roundtrip
//     const [totalQueries, pendingQueries, totalComplaints, activeUsers, totalPANCHAYATs] = await prisma.$transaction([
//       prisma.query.count(),
//       prisma.query.count({ where: { status: "PENDING_REVIEW" } }),
//       prisma.complaint.count(),
//       prisma.user.count(),
//       prisma.panchayat.count(),
//     ])

//     // --- 🚀 NEW: Dynamically fetch recent activities ---

//     // 1. Fetch recent records from different tables
//     const recentQueries = await prisma.query.findMany({
//       take: 7,
//       orderBy: { createdAt: "desc" },
//       include: { user: { select: { name: true } } },
//     })

//     const recentComplaints = await prisma.complaint.findMany({
//       take: 7,
//       orderBy: { createdAt: "desc" },
//       include: { user: { select: { name: true } } },
//     })

//     const recentUsers = await prisma.user.findMany({
//       take: 7,
//       where: { role: "VOTER" },
//       orderBy: { createdAt: "desc" },
//     })

//     // 2. Map them to a common notification format
//     const queryNotifications = recentQueries.map(q => ({
//       id: q.id,
//       title: `New Query: ${q.title}`,
//       message: `Submitted by ${q.user.name}.`,
//       type: "NEW_QUERY",
//       createdAt: q.createdAt,
//     }))

//     const complaintNotifications = recentComplaints.map(c => ({
//       id: c.id,
//       title: `New Complaint: ${c.subject}`,
//       message: `Filed by ${c.user.name}.`,
//       type: "NEW_COMPLAINT",
//       createdAt: c.createdAt,
//     }))

//     const userNotifications = recentUsers.map(u => ({
//       id: u.id,
//       title: "New User Registered",
//       message: `${u.name} has joined as a Voter.`,
//       type: "NEW_USER",
//       createdAt: u.createdAt,
//     }))

//     // 3. Combine, sort, and slice to get the 7 most recent activities
//     const allActivities = [...queryNotifications, ...complaintNotifications, ...userNotifications]
//       .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//       .slice(0, 7)

//     // Combine all stats into a single response object
//     const stats = {
//       totalQueries,
//       pendingQueries,
//       totalComplaints,
//       activeUsers,
//       totalPANCHAYATs,
//       recentNotifications: allActivities.map((n) => ({
//         id: n.id,
//         title: n.title,
//         message: n.message,
//         time: new Intl.DateTimeFormat("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//         }).format(n.createdAt),
//         type: n.type,
//       })),
//     }

//     return NextResponse.json(stats)
//   } catch (error) {
//     console.error("Admin stats fetch error:", error)
//     return NextResponse.json(
//       { error: { code: "INTERNAL_ERROR", message: "Failed to fetch admin statistics" } },
//       { status: 500 }
//     )
//   }
// }
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

    // Get all counts
    const [totalQueries, pendingQueries, totalComplaints, activeUsers, totalPANCHAYATs] = await prisma.$transaction([
      prisma.query.count(),
      prisma.query.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.complaint.count(),
      prisma.user.count(),
      prisma.panchayat.count(),
    ])

    // 1. Fetch recent records, including Panchayat name for queries
    const recentQueries = await prisma.query.findMany({
      take: 7,
      orderBy: { createdAt: "desc" },
      include: {
        panchayat: {
          select: { name: true },
        },
      },
    })

    const recentComplaints = await prisma.complaint.findMany({
      take: 7,
      orderBy: { createdAt: "desc" },
    })

    const recentUsers = await prisma.user.findMany({
      take: 7,
      where: { role: "VOTER" },
      orderBy: { createdAt: "desc" },
    })

    // 2. Map them to a common notification format
    const queryNotifications = recentQueries.map(q => {
      // --- UPDATE: Add highlighting around location details ---
      let message = "A new query has been submitted"
      const locationParts = []
      if (q.panchayat?.name) {
        locationParts.push(q.panchayat.name)
      }
      if (q.wardNumber) {
        locationParts.push(`Ward No. ${q.wardNumber}`)
      }

      if (locationParts.length > 0) {
        // Add asterisks for highlighting
        message += ` from **${locationParts.join(", ")}**.`
      } else {
        message += "."
      }

      return {
        id: q.id,
        title: `New Query: ${q.title}`,
        message: message,
        type: "NEW_QUERY",
        createdAt: q.createdAt,
      }
    })

    const complaintNotifications = recentComplaints.map(c => ({
      id: c.id,
      title: `New Complaint: ${c.subject}`,
      message: "A new complaint has been filed.",
      type: "NEW_COMPLAINT",
      createdAt: c.createdAt,
    }))

    const userNotifications = recentUsers.map(u => ({
      id: u.id,
      title: "New User Registered",
      message: "A new user has registered as a Voter.",
      type: "NEW_USER",
      createdAt: u.createdAt,
    }))

    // 3. Combine, sort, and slice to get the 7 most recent activities
    const allActivities = [...queryNotifications, ...complaintNotifications, ...userNotifications]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 7)

    // Combine all stats into a single response object
    const stats = {
      totalQueries,
      pendingQueries,
      totalComplaints,
      activeUsers,
      totalPANCHAYATs,
      recentNotifications: allActivities.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
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