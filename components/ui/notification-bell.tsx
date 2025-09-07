'use client'

import { useState, useCallback, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Loader2, Check, CheckCircle, MessageSquare, ThumbsUp, Share2, AtSign, AlertCircle } from 'lucide-react'
import { useNotifications } from '../providers/notification-provider'
import { Button } from './button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'

interface NotificationBellProps {
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  type: string
  queryId?: string
  createdAt: string
  metadata?: {
    details?: string
  }
}

export function NotificationBell({ setIsSidebarOpen }: NotificationBellProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const { unreadCount, markNotificationAsRead, markAllNotificationsAsRead, refreshNotifications } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'like':
        return <ThumbsUp className="h-5 w-5 text-pink-500" />
      case 'share':
        return <Share2 className="h-5 w-5 text-purple-500" />
      case 'mention':
        return <AtSign className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getBasePath = useCallback(() => {
    if (typeof window === 'undefined') return '/dashboard/voter';
    const currentPath = window.location.pathname;
    
    // Check for admin paths
    if (currentPath.startsWith('/dashboard/admin') || currentPath.includes('/admin/')) {
      return '/dashboard/admin';
    }
    // Check for panchayat paths
    if (currentPath.startsWith('/dashboard/panchayat') || currentPath.includes('/panchayat/')) {
      return '/dashboard/panchayat';
    }
    // Default to voter
    return '/dashboard/voter';
  }, []);

  const handleNotificationClick = useCallback(async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
      }
      
      if (notification.queryId) {
        setIsOpen(false);
        const basePath = getBasePath();
        router.push(`${basePath}/queries/${notification.queryId}`);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to process notification');
    }
  }, [markNotificationAsRead, router, getBasePath]);
  
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoadingNotifications(true)
      const basePath = getBasePath();
      const isAdmin = basePath.includes('/admin');
      
      let response;
      if (isAdmin) {
        // For admin, fetch all relevant notifications
        response = await fetch('/api/notifications?limit=50', {
          credentials: 'include'
        });
      } else {
        // For regular users, fetch their notifications
        response = await fetch('/api/notifications?limit=10', {
          credentials: 'include'
        });
      }
      
      if (response.status === 401) {
        window.location.href = '/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname)
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [])
  
  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('[data-notification-dropdown]');
      const button = document.querySelector('[data-notification-button]');
      
      if (dropdown && button) {
        const isClickInside = dropdown.contains(target) || button.contains(target);
        if (!isClickInside) {
          setIsOpen(false);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    fetchNotifications();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, fetchNotifications]);
  
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isMobile) {
            const basePath = getBasePath();
            if (basePath.includes('/admin')) {
              router.push('/dashboard/admin/notifications');
            } else {
              router.push(`${basePath}/notifications`);
            }
            setIsSidebarOpen?.(false);
            return;
          }
          setIsOpen(!isOpen);
        }}
        data-notification-button
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-blue-600' : 'text-gray-600'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {!isMobile && (
        <div 
          data-notification-dropdown
          className={`fixed sm:absolute left-0 w-[calc(100vw-4rem)] sm:w-96 bg-white rounded-xl border border-gray-200 overflow-hidden z-[10000] transform transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none hidden'
          }`}
          style={{
            maxHeight: 'calc(100vh - 6rem)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="sticky top-0 z-10 p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 text-base sm:text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1 -mr-1 text-gray-400 hover:text-gray-500"
                aria-label="Close notifications"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs px-2 h-7 text-blue-600 hover:bg-blue-100/50 hover:text-blue-700 transition-colors"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await markAllNotificationsAsRead();
                    await refreshNotifications();
                    toast.success('All notifications marked as read');
                  } catch (error) {
                    toast.error('Failed to mark all as read');
                  }
                }}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>
          
          {isLoadingNotifications ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium sm:text-sm">No notifications yet</p>
              <p className="text-gray-400 text-xs sm:text-xs mt-1 px-4">When you get notifications, they'll appear here</p>
            </div>
          ) : (
            <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    role="button"
                    tabIndex={0}
                    className={`px-4 py-3 sm:py-2.5 active:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                      !notification.isRead ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleNotificationClick(notification)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleNotificationClick(notification)
                      } else if (e.key === 'Escape') {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${
                        !notification.isRead 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getNotificationIcon(notification.type.toLowerCase())}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                        {notification.metadata?.details && (
                          <div className="mt-1.5 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1.5">
                            {notification.metadata.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-10 flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200 hover:border-blue-300 transition-colors py-2"
              onClick={() => {
                const basePath = getBasePath();
                setIsOpen(false);
                if (basePath.includes('/admin')) {
                  router.push('/dashboard/admin/notifications');
                } else {
                  router.push(`${basePath}/notifications`);
                }
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
