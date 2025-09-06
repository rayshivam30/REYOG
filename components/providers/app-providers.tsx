'use client'

import { ThemeProvider } from 'next-themes'
import { NotificationProvider } from './notification-provider'
import { WebSocketProvider } from '@/contexts/websocket-context'
import { NotificationToast } from '@/components/notifications/notification-toast'
import { Toaster } from '@/components/ui/sonner'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WebSocketProvider>
        <NotificationProvider>
          {children}
          <NotificationToast />
          <Toaster position="bottom-right" richColors />
        </NotificationProvider>
      </WebSocketProvider>
    </ThemeProvider>
  )
}
