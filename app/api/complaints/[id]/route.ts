import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { complaintUpdateSchema } from "@/lib/validations"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Admin access required" } }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = complaintUpdateSchema.parse(body)

    const complaint = await prisma.complaint.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        resolutionNote: validatedData.resolutionNote,
        resolvedAt: validatedData.status === "RESOLVED" ? new Date() : null,
      },
      include: {
        user: { select: { name: true, email: true } },
        panchayat: { select: { name: true } },
      },
    })

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to update complaint" } },
      { status: 500 },
    )
  }
}
