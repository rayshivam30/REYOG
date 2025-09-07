"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Bell, 
  BellOff, 
  Check, 
  Filter, 
  Search, 
  X,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  Share2,
  AtSign
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Notification = {
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

const getNotificationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'success':
      return <Check className="h-4 w-4 text-green-500" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case 'like':
      return <ThumbsUp className="h-4 w-4 text-pink-500" />
    case 'share':
      return <Share2 className="h-4 w-4 text-purple-500" />
    case 'mention':
      return <AtSign className="h-4 w-4 text-yellow-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "unread">("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Fetch admin notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true)
        // First get admin stats which includes notifications
        const statsResponse = await fetch('/api/admin/stats', {
          credentials: 'include'
        })
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch admin stats')
        }
        
        const statsData = await statsResponse.json()
        
        // Then get all notifications for the admin
        const notificationsResponse = await fetch('/api/notifications?limit=100', {
          credentials: 'include'
        })
        
        if (!notificationsResponse.ok) {
          throw new Error('Failed to fetch notifications')
        }
        
        const notificationsData = await notificationsResponse.json()
        
        // Process notifications from stats (ensure they have all required fields)
        const statsNotifications = (statsData.recentNotifications || []).map((notification: any) => ({
          ...notification,
          isRead: true, // Assume admin notifications are read by default
          createdAt: new Date(notification.time || notification.createdAt || Date.now()).toISOString()
        }))

        // Process notifications from the notifications API
        const userNotifications = (notificationsData.notifications || []).map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt).toISOString()
        }))

        // Combine both notification sources and remove duplicates
        const allNotifications = [...statsNotifications, ...userNotifications]
        
        // Remove duplicates by ID and sort by date (newest first)
        const uniqueNotifications = Array.from(new Map(
          allNotifications.map(n => [n.id, n])
        ).values()).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setNotifications(uniqueNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast.error("Failed to load notifications. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { 
        method: 'PATCH',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ))
      
      // Refresh unread count in the notification bell
      const event = new CustomEvent('refresh-notifications')
      window.dispatchEvent(event)
      
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', { 
        method: 'POST',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }
      
      setNotifications(notifications.map(n => ({
        ...n,
        isRead: true
      })))
      
      // Refresh unread count in the notification bell
      const event = new CustomEvent('refresh-notifications')
      window.dispatchEvent(event)
      
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || !notification.isRead
    
    return matchesSearch && matchesStatus
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X 
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                <div className="p-2">
                  <div 
                    className="flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStatusFilter("all")
                      setShowFilterDropdown(false)
                    }}
                  >
                    <span className={`mr-2 h-2 w-2 rounded-full ${statusFilter === 'all' ? 'bg-blue-500' : 'bg-transparent'}`} />
                    All Notifications
                  </div>
                  <div 
                    className="flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStatusFilter("unread")
                      setShowFilterDropdown(false)
                    }}
                  >
                    <span className={`mr-2 h-2 w-2 rounded-full ${statusFilter === 'unread' ? 'bg-blue-500' : 'bg-transparent'}`} />
                    Unread Only
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Notification</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <BellOff className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No notifications found</p>
                    <p className="text-xs text-muted-foreground">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter'
                        : 'You\'re all caught up!'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((notification) => (
                <TableRow 
                  key={notification.id}
                  className={!notification.isRead ? 'bg-blue-50/50' : ''}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className={`p-1.5 rounded-full ${!notification.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          <span>Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}