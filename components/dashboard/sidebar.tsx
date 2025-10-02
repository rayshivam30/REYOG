"use client"

import { useEffect } from "react"
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

  // Handle click outside to close on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('.sidebar-container');
      const toggleButton = document.querySelector('.sidebar-toggle-button');
      
      if (isSidebarOpen && 
          !sidebar?.contains(target) && 
          !toggleButton?.contains(target) &&
          window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <div className="flex h-full flex-col sidebar-container">
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-slate-700 px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">ReYog</span>
          </Link>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="hidden md:flex p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 sidebar-toggle-button"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
          <button 
            className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-300 font-medium">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{roleDisplayText}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 sidebar-scrollbar">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                {item.heading && (
                  <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {item.heading}
                  </h2>
                )}
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${isActive ? 'bg-gray-100 dark:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}>
                      {item.label}
                    </span>
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-4 space-y-3">
        <SOSModal />
        <LogoutButton />
      </div>
    </div>
  )
}