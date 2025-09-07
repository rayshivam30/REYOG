'use client'

import { useState, useCallback, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Loader2, Check, CheckCircle, MessageSquare, ThumbsUp, Share2, AtSign, AlertCircle } from 'lucide-react'
import { useNotifications } from '../providers/notification-provider'
import { Button } from './button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

export function NotificationBell() {
  const router = useRouter()
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
      const response = await fetch('/api/notifications', {
        credentials: 'include'
      })
      
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
  
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, fetchNotifications])
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
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
      
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 transform transition-all duration-200 ease-in-out"
          style={{
            maxHeight: '80vh',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
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
              <p className="text-gray-600 font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">When you get notifications, they'll appear here</p>
            </div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
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
                      }
                    }}
                    role="button"
                    tabIndex={0}
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
          
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => {
                const basePath = getBasePath();
                setIsOpen(false);
                router.push(`${basePath}/notifications`);
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
