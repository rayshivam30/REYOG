"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X } from "lucide-react"
import { useState } from "react"
// Consistent import path using '@' alias
import { GoogleTranslate } from "@/components/GoogleTranslate"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Function to close the menu, useful for links and buttons
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ReYog</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/offices" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Offices
            </Link>
            <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Services
            </Link>
          </nav>

          {/* Desktop CTA & Toggles */}
          <div className="hidden md:flex items-center space-x-4">
            <GoogleTranslate />
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {/* Mobile Toggles Added Here */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Settings</span>
              <div className="flex items-center gap-4">
                <GoogleTranslate />
                <ThemeToggle />
              </div>
            </div>

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