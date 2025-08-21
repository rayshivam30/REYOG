import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.nGO.delete({
      where: { id },
    })

    return NextResponse.json({ message: "NGO deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete NGO" }, { status: 500 })
  }
}