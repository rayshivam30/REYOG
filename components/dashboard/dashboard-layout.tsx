"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import type { UserRole } from "@prisma/client"
import { Menu, Home, FileText, AlertCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 relative">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="w-8"></div> {/* For balance */}
      </header>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 shadow-xl",
          "flex flex-col h-screen",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen pt-16 md:pt-0 bg-gray-50 dark:bg-black">
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 bg-white dark:bg-black text-gray-900 dark:text-white">
          {children}
        </main>
        
        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 z-30 safe-area-pb">
          <div className="grid grid-cols-4 px-2 py-1">
            {user.role === 'ADMIN' ? (
              <>
                <Link 
                  href="/dashboard/admin" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Home</span>
                </Link>
                <Link 
                  href="/dashboard/admin/queries" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">All Queries</span>
                </Link>
                <Link 
                  href="/dashboard/admin/complaints" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Complaints</span>
                </Link>
                <Link 
                  href="/dashboard/admin/ngos" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">NGOs</span>
                </Link>
              </>
            ) : user?.role === 'PANCHAYAT' ? (
              <>
                <Link 
                  href="/dashboard/panchayat" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-blue-600"
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Home</span>
                </Link>
                <Link 
                  href="/dashboard/panchayat/queries/all" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Inbox</span>
                </Link>
                <Link 
                  href="/dashboard/panchayat/queries" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Active</span>
                </Link>
                <Link 
                  href="/dashboard/panchayat/stats" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Stats</span>
                </Link>
              </>
            ) : (
              // Voter Navigation
              <>
                <Link 
                  href="/dashboard/voter" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    pathname === "/dashboard/voter" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Home</span>
                </Link>
                <Link 
                  href="/dashboard/voter/queries" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    pathname === "/dashboard/voter/queries" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Inbox</span>
                </Link>
                <Link 
                  href="/dashboard/voter/queries/new" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    pathname === "/dashboard/voter/queries/new" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span className="text-xs mt-1 text-center">Raise Query</span>
                </Link>
                <Link 
                  href="/dashboard/voter/profile" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    pathname === "/dashboard/voter/profile" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Profile</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}