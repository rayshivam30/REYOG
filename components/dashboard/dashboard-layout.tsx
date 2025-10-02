"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import type { UserRole } from "@prisma/client"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/ui/notification-bell"

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

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
        })
        if (response.ok) {
          const result = await response.json()
          setUser(result.user)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-slate-200"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300">Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const dashboardTitle = (pathname: string | null) => {
    if (!pathname) return 'Dashboard';
    if (pathname.startsWith('/dashboard/voter')) return 'Voter Dashboard';
    if (pathname.startsWith('/dashboard/panchayat')) return 'Panchayat Dashboard';
    if (pathname.startsWith('/dashboard/admin')) return 'Admin Dashboard';
    return 'Dashboard';
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 relative flex">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 shadow-xl border-r border-gray-200 dark:border-slate-700",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-64"
        )}
      >
        <Sidebar 
          userRole={user.role} 
          userName={user.name}
          panchayatName={user.panchayat?.name}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300 ease-in-out", isSidebarOpen ? "md:ml-64" : "md:ml-0")}>
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center px-4 transition-all duration-300 ease-in-out" 
          style={{ left: isSidebarOpen ? '16rem' : '0' }}>
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {dashboardTitle(pathname)}
            </h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pt-16 pb-4 px-4 md:px-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}