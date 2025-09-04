"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import { SOSModal } from "@/components/sos-modal"
import { GoogleTranslate } from "@/components/i18n/GoogleTranslate"
import {
  Building2,
  FileText,
  MapPin,
  Star,
  MessageSquare,
  BarChart3,
  Users,
  Bell,
  Home,
  X,
  Inbox,
  User, // Added User icon for profile
} from "lucide-react"
import type { UserRole } from "@prisma/client"

interface SidebarProps {
  userRole: UserRole
  userName: string
  panchayatName?: string
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

const voterNavItems = [
  { href: "/dashboard/voter", label: "Dashboard", icon: Home },
  { href: "/dashboard/voter/profile", label: "My Profile", icon: User }, // Added profile link
  { href: "/dashboard/voter/queries", label: "All Queries", icon: FileText },
  { href: "/dashboard/voter/my-queries", label: "My Queries", icon: FileText },
  { href: "/dashboard/voter/queries/new", label: "Raise Query", icon: FileText },
  { href: "/dashboard/voter/location", label: "Location Tracker", icon: MapPin },
  { href: "/dashboard/voter/top-rated", label: "Top Rated Offices", icon: Star },
  { href: "/dashboard/voter/complaints", label: "Complaints", icon: MessageSquare },
]

const panchayatNavItems = [
  { href: "/dashboard/panchayat", label: "Dashboard", icon: Home },
  { href: "/dashboard/panchayat/queries/all", label: "Inbox", icon: Inbox }, // New link added
  { href: "/dashboard/panchayat/queries", label: "Active Queries", icon: FileText },
  { href: "/dashboard/panchayat/queries/past", label: "Past Queries", icon: BarChart3 },
  { href: "/dashboard/panchayat/queries/waitlist", label: "Waitlist", icon: FileText },
  { href: "/dashboard/panchayat/stats", label: "Service Stats", icon: BarChart3 },
]

const adminNavItems = [
  { href: "/dashboard/admin", label: "Dashboard", icon: Home },
  { href: "/dashboard/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/admin/queries", label: "All Queries", icon: FileText },
  { href: "/dashboard/admin/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/ngos", label: "NGOs", icon: Building2 },
]

export function Sidebar({ userRole, userName, panchayatName, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  const getNavItems = () => {
    switch (userRole) {
      case "VOTER":
        return voterNavItems
      case "PANCHAYAT":
        return panchayatNavItems
      case "ADMIN":
        return adminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between md:block">
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-sidebar-primary" />
          <span className="text-xl font-bold text-sidebar-foreground">ReYog</span>
        </Link>
        {/* Close button for mobile */}
        <button className="md:hidden p-1 rounded-md text-sidebar-foreground" onClick={() => setIsSidebarOpen(false)}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6">
        <p className="font-medium text-sidebar-foreground">{userName}</p>
        <p className="text-sm text-sidebar-foreground/60">
          {userRole === "PANCHAYAT" && panchayatName ? panchayatName : userRole.toLowerCase()}
        </p>
      </div>

      {/* Language Selector */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <GoogleTranslate />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setIsSidebarOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Emergency SOS */}
      <div className="p-4 border-t border-sidebar-border">
        <SOSModal />
        <LogoutButton variant="outline" className="w-full mt-4" />
      </div>
    </div>
  )
}