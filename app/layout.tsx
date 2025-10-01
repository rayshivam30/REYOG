import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AppProviders } from "@/components/providers/app-providers"
import { GoogleTranslate } from "@/components/GoogleTranslate"
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <style>{`
          :root {
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
          
          body {
            font-family: ${GeistSans.style.fontFamily};
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
            @apply bg-white dark:bg-black text-slate-900 dark:text-slate-50 transition-colors duration-200;
          }
          
          /* Smooth scrolling for mobile */
          @media (prefers-reduced-motion: no-preference) {
            html {
              scroll-behavior: smooth;
            }
          }
          
          /* Google Translate Container */
          .google-translate-container {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 50;
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
            transition: transform 0.3s ease;
          }
          
          .google-translate-container:hover {
            transform: translateY(-2px);
          }
          
          /* Ensure proper dark mode for content */
          .dark {
            color-scheme: dark;
          }
          
          /* Fix for form elements in dark mode */
          input, textarea, select {
            @apply bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 rounded-md shadow-sm;
          }
          
          /* Fix for buttons in dark mode */
          button {
            @apply transition-colors duration-200;
          }
          
          /* Improved focus styles for accessibility */
          a:focus, button:focus, input:focus, textarea:focus, select:focus {
            @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
          }
          
          /* Animation classes */
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-slide-up {
            animation: slideUp 0.5s ease-out;
          }
          
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-background dark:bg-black text-foreground">
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            {children}
            <div className="google-translate-container">
              <GoogleTranslate />
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
