import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { z } from "zod"

const assignmentSchema = z.object({
  officeId: z.string().optional().nullable(),
  ngoId: z.string().optional().nullable(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser()
    if (!user || (user.role !== "PANCHAYAT" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const queryId = params.id
    const body = await request.json()
    const { officeId, ngoId } = assignmentSchema.parse(body)

    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { status: true }, // We only need to check the status
    })

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 })
    }

    // ## NEW LOGIC ##
    // This is the backend rule we are updating to match the frontend.
    const allowedStatusesForAssignment = [
      "PENDING_REVIEW",
      "ACCEPTED",
      "WAITLISTED",
      "IN_PROGRESS",
    ]

    if (!allowedStatusesForAssignment.includes(query.status)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_STATUS",
            message: `You can only assign to queries with these statuses: ${allowedStatusesForAssignment.join(", ")}`,
          },
        },
        { status: 400 },
      )
    }
    // ## END NEW LOGIC ##

    // If the status is valid, proceed with the assignment transaction
    await prisma.$transaction(async (tx) => {
      await tx.queryOfficeAssignment.deleteMany({ where: { queryId } })
      await tx.queryNgoAssignment.deleteMany({ where: { queryId } })

      if (officeId && officeId !== "none") {
        await tx.queryOfficeAssignment.create({
          data: { queryId, officeId, assignedBy: user.id },
        })
      }

      if (ngoId && ngoId !== "none") {
        await tx.queryNgoAssignment.create({
          data: { queryId, ngoId, assignedBy: user.id },
        })
      }
    })

    return NextResponse.json(
      { message: "Assignments updated successfully" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Failed to update assignments:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", issues: error.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}