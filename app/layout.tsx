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
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
