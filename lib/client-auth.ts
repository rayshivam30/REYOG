import type { UserRole } from "@prisma/client"

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  panchayatId?: string
  [key: string]: any
}

// Client-side functions that don't use server-only APIs
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]
  return token || null
}

export const clearAuthCookies = (): void => {
  if (typeof window === 'undefined') return
  
  document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

// This is a client-side only function to parse JWT payload
// Note: This doesn't verify the token, it just decodes it
// For actual verification, use server-side functions
export const parseJwt = (token: string): JWTPayload | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}
