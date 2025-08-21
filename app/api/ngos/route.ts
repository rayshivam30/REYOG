import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { ngoSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Admin access required" } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const focusArea = searchParams.get("focusArea")
    const coverage = searchParams.get("coverage")

    const ngos = await prisma.nGO.findMany({
      where: {
        ...(focusArea && { focusArea: { contains: focusArea, mode: "insensitive" } }),
        ...(coverage && { coverage: { contains: coverage, mode: "insensitive" } }),
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(ngos)
  } catch (error) {
    console.error("Error fetching NGOs:", error)
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to fetch NGOs" } }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Admin access required" } }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ngoSchema.parse(body)

    const ngo = await prisma.nGO.create({
      data: validatedData,
    })

    return NextResponse.json(ngo, { status: 201 })
  } catch (error) {
    console.error("Error creating NGO:", error)
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to create NGO" } }, { status: 500 })
  }
}
