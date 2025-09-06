import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import type { UserRole } from "@prisma/client"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  panchayatId?: string
  [key: string]: any
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET)
}

export async function signRefreshToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_REFRESH_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as JWTPayload
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
  return payload as JWTPayload
}

export async function setAuthCookies(payload: JWTPayload) {
  const token = await signToken(payload)
  const refreshToken = await signRefreshToken(payload)
  const cookieStore = await cookies()

  await cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  })

  await cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  await cookieStore.delete("token")
  await cookieStore.delete("refreshToken")
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = (await cookieStore.get("token"))?.value
  if (!token) return null

  try {
    return await verifyToken(token)
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function getAuthUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get("token")?.value
  if (!token) return null

  try {
    return await verifyToken(token)
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
