import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { queryUpdateSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
    }

    const queryId = params.id

    // Check if user has access to this query
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { userId: true, panchayatId: true },
    })

    if (!query) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Query not found" } }, { status: 404 })
    }

    const hasAccess =
      userRole === UserRole.ADMIN ||
      (userRole === UserRole.VOTER && query.userId === userId) ||
      (userRole === UserRole.PANCHAYAT && query.panchayatId === panchayatId)

    if (!hasAccess) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 })
    }

    const updates = await prisma.queryUpdate.findMany({
      where: { queryId },
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
    })

    return NextResponse.json({ updates })
  } catch (error) {
    console.error("Query updates fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching query updates" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId || (userRole !== UserRole.PANCHAYAT && userRole !== UserRole.ADMIN)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only panchayat users and admins can add query updates" } },
        { status: 403 },
      )
    }

    const queryId = params.id
    const body = await request.json()
    const { status, note, budgetSpentDelta, attachments } = queryUpdateSchema.parse(body)

    // Check if user has access to this query
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { userId: true, panchayatId: true, budgetSpent: true },
    })

    if (!query) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Query not found" } }, { status: 404 })
    }

    const hasAccess =
      userRole === UserRole.ADMIN || (userRole === UserRole.PANCHAYAT && query.panchayatId === panchayatId)

    if (!hasAccess) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 })
    }

    // Create the update
    const update = await prisma.queryUpdate.create({
      data: {
        queryId,
        userId,
        status,
        note,
        budgetSpentDelta,
        attachments,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    })

    // Update the main query if status or budget changed
    const updateData: any = {}
    if (status) {
      updateData.status = status
      if (status === "ACCEPTED") {
        updateData.acceptedAt = new Date()
      } else if (status === "RESOLVED") {
        updateData.resolvedAt = new Date()
      } else if (status === "CLOSED") {
        updateData.closedAt = new Date()
      }
    }

    if (budgetSpentDelta) {
      updateData.budgetSpent = query.budgetSpent + budgetSpentDelta
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.query.update({
        where: { id: queryId },
        data: updateData,
      })
    }

    // Create notification for the query submitter
    const queryWithUser = await prisma.query.findUnique({
      where: { id: queryId },
      include: { user: true },
    })

    if (queryWithUser) {
      await prisma.notification.create({
        data: {
          title: "Query Update",
          message: `Your query has been updated${status ? ` to ${status.replace("_", " ").toLowerCase()}` : ""}${
            note ? `: ${note}` : ""
          }`,
          type: "query_update",
          userId: queryWithUser.user.id,
          queryId,
          metadata: {
            queryId,
            status,
            updatedBy: update.user.name,
          },
        },
      })
    }

    return NextResponse.json({ update })
  } catch (error) {
    console.error("Query update creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating query update" } },
      { status: 500 },
    )
  }
}
