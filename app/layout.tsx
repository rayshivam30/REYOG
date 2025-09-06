import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AppProviders } from "@/components/providers/app-providers"
import "./globals.css"
import '@/app/leaflet.css'

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <style>{`
          :root {
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
          html {
            font-family: ${GeistSans.style.fontFamily};
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
          <AppProviders>
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  )
}
