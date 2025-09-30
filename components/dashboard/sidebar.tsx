"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import { SOSModal } from "@/components/sos-modal"
import { NotificationBell } from "@/components/ui/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"
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
  User,
} from "lucide-react"
import type { UserRole } from "@prisma/client"

// Interface for navigation items, now with an optional heading
interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  heading?: string
}

interface SidebarProps {
  userRole: UserRole
  userName: string
  panchayatName?: string
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

// Grouped navigation items for better readability
const voterNavItems: NavItem[] = [
  { href: "/dashboard/voter", label: "Dashboard", icon: Home, heading: "Home" },
  { href: "/dashboard/voter/profile", label: "My Profile", icon: User },
  { href: "/dashboard/voter/queries", label: "All Queries", icon: FileText, heading: "Queries" },
  { href: "/dashboard/voter/my-queries", label: "My Queries", icon: FileText },
  { href: "/dashboard/voter/queries/new", label: "Raise Query", icon: FileText },
  { href: "/dashboard/voter/location", label: "Location Tracker", icon: MapPin, heading: "Tools" },
  { href: "/dashboard/voter/top-rated", label: "Top Rated Offices", icon: Star },
  { href: "/dashboard/voter/complaints", label: "Complaints", icon: MessageSquare },
]

const panchayatNavItems: NavItem[] = [
  { href: "/dashboard/panchayat", label: "Dashboard", icon: Home, heading: "Home" },
  { href: "/dashboard/panchayat/queries/all", label: "Inbox", icon: Inbox, heading: "Queries" },
  { href: "/dashboard/panchayat/queries", label: "Active Queries", icon: FileText },
  { href: "/dashboard/panchayat/queries/past", label: "Past Queries", icon: BarChart3 },
  { href: "/dashboard/panchayat/queries/waitlist", label: "Waitlist", icon: FileText },
  { href: "/dashboard/panchayat/stats", label: "Service Stats", icon: BarChart3, heading: "Analytics" },
]

const adminNavItems: NavItem[] = [
  { href: "/dashboard/admin", label: "Dashboard", icon: Home, heading: "Home" },
  { href: "/dashboard/admin/userdata", label: "User Data", icon: Users, heading: "Management" },
  { href: "/dashboard/admin/queries", label: "All Queries", icon: FileText },
  { href: "/dashboard/admin/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/ngos", label: "NGOs", icon: Building2 },
]

export function Sidebar({ userRole, userName, panchayatName, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  const getNavItems = () => {
    switch (userRole) {
      case "VOTER": return voterNavItems
      case "PANCHAYAT": return panchayatNavItems
      case "ADMIN": return adminNavItems
      default: return []
    }
  }

  const navItems = getNavItems()

  // Improved display text for user role
  const roleDisplayText = userRole === "PANCHAYAT" && panchayatName
    ? panchayatName
    : userRole.charAt(0) + userRole.slice(1).toLowerCase()

  return (
    // The main container is now a fragment to handle fixed positioning better
    <>
      {/* Overlay for mobile view */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col bg-sidebar dark:bg-black border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">ReYog</span>
          </Link>
         
          <button className="md:hidden p-1 rounded-md text-sidebar-foreground" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info & Language */}
        <div className="p-4 space-y-2 border-b border-sidebar-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sidebar-foreground truncate">{userName}</p>
              <p className="text-sm text-sidebar-foreground/60">{roleDisplayText}</p>
            </div>
            <div className="mt-1">
              <NotificationBell setIsSidebarOpen={setIsSidebarOpen} />
                <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  {item.heading && (
                    <h2 className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                      {item.heading}
                    </h2>
                  )}
                  <Link href={item.href} onClick={() => setIsSidebarOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
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

        {/* Footer with SOS and Logout */}
        <div className="flex flex-col space-y-4 px-6 py-4 border-t border-border">
          <div className="flex justify-between items-center">
            <SOSModal />
          </div>
          <LogoutButton />
        </div>
      </div>
    </>
  )
}