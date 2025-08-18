import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            offices: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error("Departments fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching departments" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get("x-user-role")
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only admins can create departments" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { name, description } = body

    const department = await prisma.department.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json({ department })
  } catch (error) {
    console.error("Department creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating department" } },
      { status: 500 },
    )
  }
}
