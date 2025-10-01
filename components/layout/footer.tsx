import Link from "next/link"
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <Building2 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold">ReYog</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering rural communities through transparent governance and efficient public service delivery across
              India.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">+91 83193 11792</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">support@reyog.gov.in</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Ministry of Rural Development, New Delhi</span>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: <Facebook className="h-5 w-5" />, href: "#" },
                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#" }
              ].map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href} 
                  className="bg-background hover:bg-primary/10 p-2 rounded-full transition-colors"
                  aria-label={`Social media link ${index + 1}`}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Find Offices", href: "/offices" },
                { label: "Register", href: "/auth/register" },
                { label: "Sign In", href: "/auth/login" },
                { label: "Help & Support", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                  >
                    <span className="mr-2">→</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Services</h3>
            <ul className="space-y-3">
              {[
                { label: "Health Services", href: "#" },
                { label: "Education", href: "#" },
                { label: "Water & Sanitation", href: "#" },
                { label: "Infrastructure", href: "#" }
              ].map((service, index) => (
                <li key={index}>
                  <Link 
                    href={service.href} 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                  >
                    <span className="mr-2">→</span> {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} ReYog. All rights reserved. A project of the Ministry of Rural Development.
          </p>
        </div>
      </div>
    </footer>
  )
}
