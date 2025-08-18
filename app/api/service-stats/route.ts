import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serviceStatSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestedPanchayatId = searchParams.get("panchayatId")

    const whereClause: any = {}

    // Role-based filtering
    if (userRole === UserRole.PANCHAYAT && panchayatId) {
      whereClause.panchayatId = panchayatId
    } else if (userRole === UserRole.ADMIN && requestedPanchayatId) {
      whereClause.panchayatId = requestedPanchayatId
    } else if (userRole === UserRole.ADMIN) {
      // Admin can see all stats if no specific panchayat requested
    } else {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 })
    }

    const serviceStats = await prisma.serviceStat.findMany({
      where: whereClause,
      include: {
        panchayat: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ category: "asc" }, { metric: "asc" }],
    })

    // Group by category
    const groupedStats = serviceStats.reduce(
      (acc, stat) => {
        if (!acc[stat.category]) {
          acc[stat.category] = []
        }
        acc[stat.category].push(stat)
        return acc
      },
      {} as Record<string, typeof serviceStats>,
    )

    return NextResponse.json({ serviceStats: groupedStats })
  } catch (error) {
    console.error("Service stats fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching service stats" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId || (userRole !== UserRole.PANCHAYAT && userRole !== UserRole.ADMIN)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only panchayat users and admins can create service stats" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { category, metric, value, unit } = serviceStatSchema.parse(body)

    const targetPanchayatId = body.panchayatId || panchayatId

    if (!targetPanchayatId) {
      return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Panchayat ID is required" } }, { status: 400 })
    }

    // Check if stat already exists
    const existingStat = await prisma.serviceStat.findUnique({
      where: {
        panchayatId_category_metric: {
          panchayatId: targetPanchayatId,
          category,
          metric,
        },
      },
    })

    let serviceStat
    if (existingStat) {
      // Update existing stat
      serviceStat = await prisma.serviceStat.update({
        where: { id: existingStat.id },
        data: {
          value,
          unit,
          lastUpdated: new Date(),
        },
        include: {
          panchayat: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    } else {
      // Create new stat
      serviceStat = await prisma.serviceStat.create({
        data: {
          category,
          metric,
          value,
          unit,
          panchayatId: targetPanchayatId,
        },
        include: {
          panchayat: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    }

    return NextResponse.json({ serviceStat })
  } catch (error) {
    console.error("Service stat creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating service stat" } },
      { status: 500 },
    )
  }
}
