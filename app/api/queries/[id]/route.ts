import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the user
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch the query with related data
    const query = await prisma.query.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        panchayat: {
          select: {
            id: true,
            name: true,
            district: true,
            state: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        office: {
          select: {
            id: true,
            name: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    })

    if (!query) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this query
    // Panchayat admins can only view queries from their panchayat
    if (user.role === 'PANCHAYAT_ADMIN' && query.panchayatId !== user.panchayatId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view queries from your panchayat' },
        { status: 403 }
      )
    }

    // Regular users can only view their own queries
    if (user.role === 'VOTER' && query.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view your own queries' },
        { status: 403 }
      )
    }

    return NextResponse.json(query)
  } catch (error) {
    console.error('Error fetching query:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId || (userRole !== UserRole.PANCHAYAT && userRole !== UserRole.ADMIN)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only panchayat users and admins can update queries" } },
        { status: 403 },
      )
    }

    const queryId = params.id
    const body = await request.json()

    // Check if user has access to this query
    const existingQuery = await prisma.query.findUnique({
      where: { id: queryId },
      select: { userId: true, panchayatId: true },
    })

    if (!existingQuery) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Query not found" } }, { status: 404 })
    }

    const hasAccess =
      userRole === UserRole.ADMIN || (userRole === UserRole.PANCHAYAT && existingQuery.panchayatId === panchayatId)

    if (!hasAccess) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 })
    }

    const updateData: any = {}
    if (body.budgetIssued !== undefined) updateData.budgetIssued = body.budgetIssued
    if (body.officialIncharge !== undefined) updateData.officialIncharge = body.officialIncharge
    if (body.teamAssigned !== undefined) updateData.teamAssigned = body.teamAssigned
    if (body.estimatedStart !== undefined) updateData.estimatedStart = new Date(body.estimatedStart)
    if (body.estimatedEnd !== undefined) updateData.estimatedEnd = new Date(body.estimatedEnd)

    const updatedQuery = await prisma.query.update({
      where: { id: queryId },
      data: updateData,
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
            createdAt: "asc",
          },
        },
      },
    })

    return NextResponse.json({ query: updatedQuery })
  } catch (error) {
    console.error("Query update error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while updating query" } },
      { status: 500 },
    )
  }
}
