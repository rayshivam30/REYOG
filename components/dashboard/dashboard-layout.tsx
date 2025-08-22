// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { Sidebar } from "./sidebar"
// import type { UserRole } from "@prisma/client"

// interface User {
//   id: string
//   email: string
//   name: string
//   role: UserRole
//   panchayat?: {
//     id: string
//     name: string
//   }
// }

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("/api/auth/refresh", {
//           method: "POST",
//         })

//         if (response.ok) {
//           const result = await response.json()
//           setUser(result.user)
//         }
//       } catch (error) {
//         console.error("Failed to fetch user:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchUser()
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
//           <p className="text-muted-foreground">Please log in to access the dashboard.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex overflow-hidden">
//       {/* Fixed Sidebar */}
//       <div className="w-64 h-screen fixed top-0 left-0 z-10">
//         <Sidebar userRole={user.role} userName={user.name} panchayatName={user.panchayat?.name} />
//       </div>
      
//       {/* Main Content */}
//       <main className="flex-1 bg-background ml-64 overflow-y-auto h-screen">
//         {children}
//       </main>
//     </div>
//   )
// }
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import type { UserRole } from "@prisma/client"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* Sidebar with mobile toggle */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-sidebar transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:w-64"
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

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 md:ml-[1rem]"> {/* Adjusting margin here */}
        {/* Mobile Header with menu button */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {children}
      </main>
    </div>
  )
}