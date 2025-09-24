import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { getRateLimiter, shouldRateLimit } from './rate-limit'

export async function rateLimitMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this path should be rate limited
  if (!shouldRateLimit(pathname)) {
    return NextResponse.next()
  }

  try {
    // Get the appropriate rate limiter for this path
    const rateLimiter = getRateLimiter(pathname)

    // If no rate limiter is configured, allow the request
    if (!rateLimiter) {
      return NextResponse.next()
    }

    // Get the client identifier (IP address or user ID if authenticated)
    const identifier = getClientIdentifier(request)

    // Check rate limit
    const result = await rateLimiter.limit(identifier)

    // If rate limit exceeded, return 429 response
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil(result.reset / 1000),
          message: 'Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil(result.reset / 1000).toString(),
          },
        }
      )
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.reset.toString())

    return response
  } catch (error) {
    // If rate limiting fails, allow the request to continue
    // This prevents rate limiting from breaking the application
    console.error('Rate limiting error:', error)
    return NextResponse.next()
  }
}

// Helper function to get client identifier for rate limiting
function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from headers (set by auth middleware)
  const userId = request.headers.get('x-user-id')
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwardedFor) {
    return `ip:${forwardedFor.split(',')[0].trim()}`
  }

  if (realIP) {
    return `ip:${realIP}`
  }

  // Last resort: use a generic identifier
  return 'unknown'
}