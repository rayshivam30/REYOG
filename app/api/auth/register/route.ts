import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, setAuthCookies } from "@/lib/auth"
import { registerSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, panchayatId, wardNumber } = registerSchema.parse(body)

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

    // Check if panchayat exists
    const panchayat = await prisma.panchayat.findUnique({
      where: { id: panchayatId },
    })

    if (!panchayat) {
      return NextResponse.json(
        { error: { code: "INVALID_PANCHAYAT", message: "Selected panchayat does not exist" } },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user (only VOTER role allowed for self-registration)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "VOTER",
        panchayat: panchayatId ? {
          connect: { id: panchayatId }
        } : undefined,
        wardNumber: wardNumber || 1,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        panchayat: {
          select: {
            id: true,
            name: true,
          },
        },
        wardNumber: true,
      },
    })

    // Set auth cookies
    await setAuthCookies({
      userId: user.id,
      email: user.email,
      role: user.role,
      panchayatId: user.panchayatId,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        panchayatId: user.panchayatId,
        wardNumber: user.wardNumber,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred during registration" } },
      { status: 500 },
    )
  }
}
