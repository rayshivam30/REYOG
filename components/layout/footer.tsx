import Link from "next/link"
import { Building2, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8" />
              <span className="text-xl font-bold">ReYog</span>
            </Link>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Empowering rural communities through transparent governance and efficient public service delivery across
              India.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 83193 11792</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@reyog.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Ministry of Rural Development, New Delhi</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/offices"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Find Offices
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Health Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Water & Sanitation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Infrastructure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 ReYog - Rural Governance Platform. All rights reserved. | Built for the people of India. -- By TEAM SMAR
          </p>
        </div>
      </div>
    </footer>
  )
}
