"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils" // <-- Import cn utility

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "default", className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // We apply the new styles here
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "w-full bg-red-600 text-white hover:bg-blue-700", // <-- Your new styles
        className
      )}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  )
}