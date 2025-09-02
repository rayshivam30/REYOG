import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const assignmentSchema = z.object({
  officeIds: z.array(z.string()).optional(),
  ngoIds: z.array(z.string()).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId || userRole !== UserRole.PANCHAYAT) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only panchayat users can assign offices/NGOs to queries" } },
        { status: 403 }
      )
    }

    const queryId = params.id
    const body = await request.json()
    const { officeIds = [], ngoIds = [] } = assignmentSchema.parse(body)

    // Verify the query exists and is in the correct panchayat
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: { panchayat: true }
    })

    if (!query) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Query not found" } },
        { status: 404 }
      )
    }

    // Verify query status is ACCEPTED (can only assign to accepted queries)
    if (query.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: { code: "INVALID_STATUS", message: "Can only assign offices/NGOs to accepted queries" } },
        { status: 400 }
      )
    }

    // Get current user's panchayat to verify they can assign to this query
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { panchayatId: true }
    })

    if (!currentUser?.panchayatId || currentUser.panchayatId !== query.panchayatId) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only assign offices/NGOs to queries in your panchayat" } },
        { status: 403 }
      )
    }

    // Use transaction to handle assignments
    const result = await prisma.$transaction(async (tx) => {
      // Remove existing assignments
      await tx.queryOfficeAssignment.deleteMany({
        where: { queryId }
      })
      
      await tx.queryNgoAssignment.deleteMany({
        where: { queryId }
      })

      // Create new office assignments
      if (officeIds.length > 0) {
        await tx.queryOfficeAssignment.createMany({
          data: officeIds.map(officeId => ({
            queryId,
            officeId,
            assignedBy: userId
          }))
        })
      }

      // Create new NGO assignments
      if (ngoIds.length > 0) {
        await tx.queryNgoAssignment.createMany({
          data: ngoIds.map(ngoId => ({
            queryId,
            ngoId,
            assignedBy: userId
          }))
        })
      }

      // Update query status to IN_PROGRESS if assignments were made
      if (officeIds.length > 0 || ngoIds.length > 0) {
        await tx.query.update({
          where: { id: queryId },
          data: { status: "IN_PROGRESS" }
        })
      }

      return { officeCount: officeIds.length, ngoCount: ngoIds.length }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "query_assignments_updated",
        details: `Assigned ${result.officeCount} offices and ${result.ngoCount} NGOs to query "${query.title}"`,
        userId,
        metadata: {
          queryId,
          officeIds,
          ngoIds,
        },
      },
    })

    // Notify the query creator
    await prisma.notification.create({
      data: {
        title: "Query Assignment Updated",
        message: `Your query "${query.title}" has been assigned to offices/NGOs and is now in progress.`,
        type: "query_assigned",
        userId: query.userId,
        queryId: query.id,
        metadata: {
          queryId: query.id,
          assignedOffices: result.officeCount,
          assignedNgos: result.ngoCount,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Assigned ${result.officeCount} offices and ${result.ngoCount} NGOs to the query`,
      assignments: result
    })

  } catch (error) {
    console.error("Query assignment error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", issues: error.issues } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while assigning offices/NGOs" } },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const queryId = params.id

    const assignments = await prisma.query.findUnique({
      where: { id: queryId },
      select: {
        assignedOffices: {
          include: {
            office: {
              include: {
                department: true,
                panchayat: true
              }
            }
          }
        },
        assignedNgos: {
          include: {
            ngo: true
          }
        }
      }
    })

    if (!assignments) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Query not found" } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      offices: assignments.assignedOffices,
      ngos: assignments.assignedNgos
    })

  } catch (error) {
    console.error("Get assignments error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching assignments" } },
      { status: 500 }
    )
  }
}
