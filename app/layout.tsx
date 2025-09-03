import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import '@/app/leaflet.css';

export const metadata: Metadata = {
  title: "ReYog - Rural Governance Platform",
  description:
    "Empowering rural governance through digital connectivity. Raise queries, track services, and engage with your local government.",
  generator: "ReYog Platform",
  keywords: ["rural governance", "panchayat", "citizen services", "government queries", "India"],
  authors: [{ name: "ReYog Team" }],
  creator: "ReYog Platform",
  publisher: "ReYog",
  openGraph: {
    title: "ReYog - Rural Governance Platform",
    description: "Connect with your local government, raise queries, and track services in rural India.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReYog - Rural Governance Platform",
    description: "Empowering rural governance through digital connectivity.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f8fafc" />
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Smooth scrolling for mobile */
          @media (prefers-reduced-motion: no-preference) {
            html {
              scroll-behavior: smooth;
            }
          }
        `}</style>
      </head>
      <body className="antialiased text-foreground bg-background">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
