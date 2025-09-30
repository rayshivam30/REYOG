"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X } from "lucide-react"
import { NotificationBell } from "@/components/ui/notification-bell"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getAuthToken } from "@/lib/client-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  // Function to close the menu, useful for links and buttons
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ReYog</span>
          </Link>

          {/* CENTER: Desktop Navigation */}
          {/* I've added ml-24 here to shift the navigation block to the right */}
          <nav className="hidden md:flex items-center space-x-8 ml-24">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/offices" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Offices
            </Link>
            <Link href="/services" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Services
            </Link>
          </nav>

          {/* RIGHT: Actions and Toggles */}
          <div className="flex items-center space-x-4">
            {/* Desktop-only CTAs & Toggles */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <NotificationBell />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button className="cursor-pointer" variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="cursor-pointer">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Items visible on all screen sizes + mobile-only menu button */}
            <div className="flex items-center space-x-4">
                <div className="md:hidden">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        aria-label="Toggle menu"
                        className="p-1 rounded-md hover:bg-accent"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {/* Mobile Toggles */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Settings</span>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Links and Buttons */}
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 text-foreground hover:text-primary transition-colors" onClick={closeMenu}>
                Home
              </Link>
              <Link href="/offices" className="py-2 text-foreground hover:text-primary transition-colors" onClick={closeMenu}>
                Offices
              </Link>
              <Link href="/services" className="py-2 text-foreground hover:text-primary transition-colors" onClick={closeMenu}>
                Services
              </Link>
              
              <div className="border-t border-border pt-4 mt-2 flex flex-col space-y-2">
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={closeMenu}>
                  <Button className="w-full justify-start">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}