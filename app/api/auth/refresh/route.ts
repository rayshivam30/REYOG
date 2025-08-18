import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyRefreshToken, setAuthCookies } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh-token")?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: { code: "NO_REFRESH_TOKEN", message: "No refresh token provided" } },
        { status: 401 },
      )
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken)

    // Get updated user data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { panchayat: true },
    })

    if (!user) {
      return NextResponse.json({ error: { code: "USER_NOT_FOUND", message: "User not found" } }, { status: 401 })
    }

    // Set new auth cookies
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
        panchayat: user.panchayat,
      },
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      { error: { code: "INVALID_REFRESH_TOKEN", message: "Invalid refresh token" } },
      { status: 401 },
    )
  }
}
