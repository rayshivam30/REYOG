import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { createUserSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const userRole = request.headers.get("x-user-role") as UserRole
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only admins can create users" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { name, email, password, phone, role, panchayatId } = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: { code: "USER_EXISTS", message: "User with this email already exists" } },
        { status: 400 },
      )
    }

    // Validate panchayat assignment for PANCHAYAT role
    if (role === UserRole.PANCHAYAT && !panchayatId) {
      return NextResponse.json(
        { error: { code: "PANCHAYAT_REQUIRED", message: "Panchayat ID is required for panchayat users" } },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        panchayatId: role === UserRole.PANCHAYAT ? panchayatId : null,
      },
      include: {
        panchayat: true,
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating user" } },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const userRole = request.headers.get("x-user-role") as UserRole
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Only admins can view users" } }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        panchayat: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching users" } },
      { status: 500 },
    )
  }
}
