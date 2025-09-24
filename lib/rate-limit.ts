import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis instance for Upstash
let redis: Redis | null = null

// Initialize Redis only if environment variables are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

// Rate limit configurations for different types of endpoints
export const rateLimiters = redis ? {
  // General API routes - 100 requests per minute
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'rate_limit:general',
  }),

  // Authentication endpoints - 5 requests per minute (stricter for security)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: 'rate_limit:auth',
  }),

  // Upload endpoints - 20 requests per minute
  upload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'rate_limit:upload',
  }),

  // Admin endpoints - 50 requests per minute
  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 m'),
    analytics: true,
    prefix: 'rate_limit:admin',
  }),

  // Public endpoints - 200 requests per minute
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(160, '1 m'),
    analytics: true,
    prefix: 'rate_limit:public',
  }),
} : {}

// Rate limit configuration mapping
export const rateLimitConfig = {
  '/api/auth': 'auth',
  '/api/uploads': 'upload',
  '/api/admin': 'admin',
  '/api/panchayats': 'public',
  '/api/offices': 'public',
  '/api/departments': 'public',
  '/api/users': 'general',
  '/api/complaints': 'general',
  '/api/queries': 'general',
  '/api/notifications': 'general',
  '/api/ngos': 'public',
  '/api/assignments': 'admin',
  '/api/ratings': 'general',
  '/api/service-stats': 'general',
  '/api/download': 'general',
  '/api/socket': 'general',
  '/api/test-db': 'admin', // Test endpoints should be admin only
} as const

export type RateLimitType = keyof typeof rateLimitConfig

// Helper function to get rate limiter for a path
export function getRateLimiter(pathname: string): Ratelimit | null {
  // If Redis is not configured, return null (no rate limiting)
  if (!redis) {
    return null
  }

  // Find the most specific matching rate limit configuration
  const matchingKey = Object.keys(rateLimitConfig)
    .sort((a, b) => b.length - a.length) // Sort by length descending to match more specific paths first
    .find(key => pathname.startsWith(key))

  const rateLimitType = matchingKey ? rateLimitConfig[matchingKey as RateLimitType] : 'general'

  return rateLimiters[rateLimitType] || null
}

// Helper function to check if a path should be rate limited
export function shouldRateLimit(pathname: string): boolean {
  // Don't rate limit if Redis is not configured
  if (!redis) {
    return false
  }

  // Don't rate limit static files, Next.js internals, or health checks
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') || // Files with extensions
    pathname === '/health' ||
    pathname === '/api/health'
  ) {
    return false
  }

  // Rate limit all API routes
  return pathname.startsWith('/api/')
}