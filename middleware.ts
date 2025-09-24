import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthUserFromRequest } from "./lib/auth"
import { rateLimitMiddleware } from "./lib/rate-limit-middleware"
import {UserRole} from "@prisma/client"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply rate limiting first
  const rateLimitResponse = await rateLimitMiddleware(request)
  if (rateLimitResponse.status !== 200) {
    return rateLimitResponse
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/", 
    "/offices", 
    "/auth/login", 
    "/auth/register",
    "/api/panchayats",
    "/api/uploads",  // Add uploads to public routes since we handle auth in the route
    "/api/offices",  // Add offices API to public routes
    "/api/departments"  // Add departments API to public routes (needed for office search)
  ]
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || 
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/panchayats") ||
    pathname.startsWith("/api/uploads") ||
    pathname.startsWith("/api/offices") ||  // Also check for offices path
    pathname.startsWith("/api/departments")  // Also check for departments path
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get user from token
  const user = await getAuthUserFromRequest(request)

  // Redirect to login if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Role-based route protection
  if (pathname.startsWith("/dashboard/voter") && user.role !== UserRole.VOTER) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (pathname.startsWith("/dashboard/panchayat") && user.role !== UserRole.PANCHAYAT) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (pathname.startsWith("/dashboard/admin") && user.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // API route protection
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth") && !pathname.startsWith("/api/panchayats") && !pathname.startsWith("/api/uploads")) {
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", user.userId)
    requestHeaders.set("x-user-role", user.role)
    requestHeaders.set("x-user-email", user.email)
    if (user.panchayatId) {
      requestHeaders.set("x-user-panchayat-id", user.panchayatId)
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}