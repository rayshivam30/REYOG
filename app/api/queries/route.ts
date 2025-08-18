import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createQuerySchema } from "@/lib/validations"
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
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const whereClause: any = {}

    // Role-based filtering
    if (userRole === UserRole.VOTER) {
      whereClause.userId = userId
    } else if (userRole === UserRole.PANCHAYAT && panchayatId) {
      whereClause.panchayatId = panchayatId
    }
    // ADMIN can see all queries (no additional filter)

    if (status) {
      whereClause.status = status
    }

    const queries = await prisma.query.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        department: true,
        office: true,
        panchayat: true,
        updates: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            updates: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ queries })
  } catch (error) {
    console.error("Queries fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching queries" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can create queries" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { title, description, departmentId, officeId, latitude, longitude, attachments } =
      createQuerySchema.parse(body)

    // If office is selected, get its panchayat
    let panchayatId = null
    if (officeId) {
      const office = await prisma.office.findUnique({
        where: { id: officeId },
        select: { panchayatId: true },
      })
      panchayatId = office?.panchayatId || null
    }

    const query = await prisma.query.create({
      data: {
        title,
        description,
        userId,
        departmentId,
        officeId,
        panchayatId,
        latitude,
        longitude,
        attachments,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        department: true,
        office: true,
        panchayat: true,
      },
    })

    // Create notification for panchayat users if panchayat is assigned
    if (panchayatId) {
      const panchayatUsers = await prisma.user.findMany({
        where: {
          role: UserRole.PANCHAYAT,
          panchayatId,
        },
      })

      await Promise.all(
        panchayatUsers.map((panchayatUser) =>
          prisma.notification.create({
            data: {
              title: "New Query Submitted",
              message: `A new query "${title}" has been submitted and requires review.`,
              type: "query_created",
              userId: panchayatUser.id,
              queryId: query.id,
              metadata: {
                queryId: query.id,
                submittedBy: query.user.name,
              },
            },
          }),
        ),
      )
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "query_created",
        details: `Query "${title}" created`,
        userId,
        metadata: {
          queryId: query.id,
          title,
          department: query.department?.name,
        },
      },
    })

    return NextResponse.json({ query })
  } catch (error) {
    console.error("Query creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating query" } },
      { status: 500 },
    )
  }
}
