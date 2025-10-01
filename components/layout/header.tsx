"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, User, Bell } from "lucide-react"
import { NotificationBell } from "@/components/ui/notification-bell"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getAuthToken } from "@/lib/client-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken()
    setIsAuthenticated(!!token)
    
    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Function to close the menu, useful for links and buttons
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Building2 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold text-foreground">ReYog</span>
          </Link>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/offices" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
              Offices
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/services" className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* RIGHT: Actions and Toggles */}
          <div className="flex items-center space-x-4">
            {/* Desktop-only CTAs & Toggles */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <NotificationBell />
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button className="cursor-pointer" variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="cursor-pointer hover:scale-105 transition-transform">Get Started</Button>
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
                        className="p-1.5 rounded-md hover:bg-accent/50 transition-colors"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top duration-300">
            {/* Mobile Toggles */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Settings</span>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {isAuthenticated && <NotificationBell />}
              </div>
            </div>

            {/* Mobile Links and Buttons */}
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 text-foreground hover:text-primary transition-colors flex items-center" onClick={closeMenu}>
                Home
              </Link>
              <Link href="/offices" className="py-2 text-foreground hover:text-primary transition-colors flex items-center" onClick={closeMenu}>
                Offices
              </Link>
              <Link href="/services" className="py-2 text-foreground hover:text-primary transition-colors flex items-center" onClick={closeMenu}>
                Services
              </Link>
              
              <div className="border-t border-border pt-4 mt-2 flex flex-col space-y-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" onClick={closeMenu}>
                    <Button className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={closeMenu}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={closeMenu}>
                      <Button className="w-full justify-start">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}