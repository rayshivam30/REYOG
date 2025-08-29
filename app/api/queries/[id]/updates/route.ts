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

// --- MODIFIED POST FUNCTION ---
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

    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { userId: true, panchayatId: true, budgetSpent: true, user: true },
    })

    if (!query) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Query not found" } }, { status: 404 })
    }

    const hasAccess =
      userRole === UserRole.ADMIN || (userRole === UserRole.PANCHAYAT && query.panchayatId === panchayatId)

    if (!hasAccess) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 })
    }

    // **IMPROVEMENT**: Wrap database writes in a transaction for data consistency
    const update = await prisma.$transaction(async (tx) => {
      // **THE FIX**: Prepare data and conditionally add attachments in the correct format
      const dataForUpdateCreate: any = {
        queryId,
        userId,
        status,
        note,
        budgetSpentDelta,
      }

      if (attachments && attachments.length > 0) {
        dataForUpdateCreate.attachments = {
          // Use the 'create' keyword for nested writes
          create: attachments.map((att) => ({
            url: att.url,
            filename: att.filename,
            size: att.size,
            type: att.type,
            userId: userId,
          })),
        }
      }

      // 1. Create the QueryUpdate record
      const newUpdate = await tx.queryUpdate.create({
        data: dataForUpdateCreate,
        include: {
          user: {
            select: { id: true, name: true, role: true },
          },
        },
      })

      // 2. Update the main Query record
      const queryUpdateData: any = {}
      if (status) {
        queryUpdateData.status = status
        if (status === "ACCEPTED") {
          queryUpdateData.acceptedAt = new Date()
        } else if (status === "RESOLVED") {
          queryUpdateData.resolvedAt = new Date()
        } else if (status === "CLOSED") {
          queryUpdateData.closedAt = new Date()
        }
      }

      if (budgetSpentDelta) {
        queryUpdateData.budgetSpent = query.budgetSpent + budgetSpentDelta
      }

      if (Object.keys(queryUpdateData).length > 0) {
        await tx.query.update({
          where: { id: queryId },
          data: queryUpdateData,
        })
      }

      // 3. Create the Notification record
      await tx.notification.create({
        data: {
          title: "Query Update",
          message: `Your query has been updated${status ? ` to ${status.replace("_", " ").toLowerCase()}` : ""}${
            note ? `: ${note}` : ""
          }`,
          type: "query_update",
          userId: query.user.id,
          queryId,
          metadata: {
            queryId,
            status,
            updatedBy: newUpdate.user.name,
          },
        },
      })

      return newUpdate
    })

    return NextResponse.json({ update })
  } catch (error) {
    console.error("Query update creation error:", error)
    // Handle Zod validation errors specifically
    if (error instanceof require("zod").ZodError) {
      return NextResponse.json({ error: { code: "INVALID_INPUT", message: error.errors } }, { status: 400 })
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating query update" } },
      { status: 500 },
    )
  }
}