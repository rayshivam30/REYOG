"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import type { UserRole } from "@prisma/client"
import { Menu, Home, FileText, AlertCircle, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="text-lg font-semibold text-gray-900">
          {user?.role === 'VOTER' ? 'Voter Dashboard' : 'Dashboard'}
        </div>
        <div className="w-8"></div> {/* For balance */}
      </header>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out bg-white shadow-xl",
          "flex flex-col h-screen",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Sidebar 
          userRole={user?.role || 'VOTER'} 
          userName={user?.name || 'User'}
          panchayatName={user?.panchayat?.name}
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
      <div className="md:pl-64 flex flex-col min-h-screen pt-16 md:pt-0">
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
        
        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-pb">
          <div className="grid grid-cols-4 px-2 py-1">
            {user?.role === 'ADMIN' ? (
              <>
                <Link 
                  href="/dashboard/admin" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Home</span>
                </Link>
                <Link 
                  href="/dashboard/admin/queries" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    "text-gray-600 hover:text-blue-600"
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
            ) : (
              <>
                <Link 
                  href="/dashboard/panchayat" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    user?.role === 'PANCHAYAT' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Home</span>
                </Link>
                <Link 
                  href="/dashboard/panchayat/queries/all" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    user?.role === 'PANCHAYAT' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Inbox</span>
                </Link>
                <Link 
                  href="/dashboard/panchayat/queries" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    user?.role === 'PANCHAYAT' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Active</span>
                </Link>
                <Link 
                  href="/dashboard/panchayat/stats" 
                  className={cn(
                    "flex flex-col items-center p-2 min-h-16",
                    user?.role === 'PANCHAYAT' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 text-center">Stats</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}