import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, setAuthCookies } from "@/lib/auth"
import { loginSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { panchayat: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
        { status: 401 },
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
        { status: 401 },
      )
    }

    // Set auth cookies
    await setAuthCookies({
      userId: user.id,
      email: user.email,
      role: user.role,
      panchayatId: user.panchayatId || undefined,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone || undefined,
        panchayat: user.panchayat,
        wardNumber: user.wardNumber || undefined,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred during login" } },
      { status: 500 },
    )
  }
}
