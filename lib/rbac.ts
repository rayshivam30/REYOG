import { UserRole } from "@prisma/client"
import type { JWTPayload } from "./auth"

export const ROLE_HIERARCHY = {
  [UserRole.VOTER]: 1,
  [UserRole.PANCHAYAT]: 2,
  [UserRole.ADMIN]: 3,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function requireRole(user: JWTPayload | null, requiredRole: UserRole): boolean {
  if (!user) return false
  return hasRole(user.role, requiredRole)
}

export function canAccessRoute(user: JWTPayload | null, routeRole: UserRole): boolean {
  if (!user) return false
  return user.role === routeRole
}
