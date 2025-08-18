"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { UserRole } from "@prisma/client"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  panchayat?: {
    id: string
    name: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        setUser(result.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth refresh error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
