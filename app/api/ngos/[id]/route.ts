import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { ngoSchema } from "@/lib/validations"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Admin access required" } }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ngoSchema.parse(body)

    const ngo = await prisma.nGO.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(ngo)
  } catch (error) {
    console.error("Error updating NGO:", error)
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to update NGO" } }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Admin access required" } }, { status: 401 })
    }

    await prisma.nGO.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting NGO:", error)
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to delete NGO" } }, { status: 500 })
  }
}
