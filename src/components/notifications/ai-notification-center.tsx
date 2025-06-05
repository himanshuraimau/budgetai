"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge" 
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Alert, AlertDescription } from "../ui/alert"
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Brain, 
  DollarSign, 
  Clock,
  Zap,
  Shield,
  Eye,
  MoreHorizontal,
  X
} from "lucide-react"

interface AINotification {
  id: string
  type: 'decision' | 'payment' | 'alert' | 'insight'
  title: string
  message: string
  decision?: 'approve' | 'deny' | 'escalate'
  agentId: string
  agentName: string
  confidence?: number
  amount?: number
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  metadata?: any
}

export function AINotificationCenter() {
  const [notifications, setNotifications] = useState<AINotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time notifications
  useEffect(() => {
    // Initial load
    fetchNotifications()
    
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000)
    
    // Simulate random new notifications for demo
    const notificationInterval = setInterval(() => {
      addRandomNotification()
    }, 15000)
    
    return () => {
      clearInterval(interval)
      clearInterval(notificationInterval)
    }
  }, [])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length)
  }, [notifications])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from your API
      const response = await fetch('/api/agents/feedback?type=notifications')
      const data = await response.json()
      
      if (data.success && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addRandomNotification = () => {
    const sampleNotifications = [
      {
        id: `notif-${Date.now()}`,
        type: 'decision' as const,
        title: 'Purchase Request Approved',
        message: 'Office supplies request for $85 has been automatically approved',
        decision: 'approve' as const,
        agentId: 'universal-approval',
        agentName: 'Universal Approval Agent',
        confidence: 92,
        amount: 85,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'medium' as const
      },
      {
        id: `notif-${Date.now() + 1}`,
        type: 'alert' as const,
        title: 'Unusual Spending Detected',
        message: 'Travel expenses are 30% higher than usual this month',
        agentId: 'budget-guardian',
        agentName: 'Budget Guardian Agent',
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'high' as const
      },
      {
        id: `notif-${Date.now() + 2}`,
        type: 'payment' as const,
        title: 'Payment Executed',
        message: 'Reimbursement of $245 transferred to employee wallet',
        agentId: 'payment-execution',
        agentName: 'Payment Execution Agent',
        amount: 245,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'low' as const
      }
    ]
    
    const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)]
    setNotifications(prev => [randomNotification, ...prev])
  }

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const getNotificationIcon = (type: string, decision?: string) => {
    switch (type) {
      case 'decision':
        switch (decision) {
          case 'approve': return <CheckCircle className="h-4 w-4 text-green-600" />
          case 'deny': return <XCircle className="h-4 w-4 text-red-600" />
          case 'escalate': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
          default: return <Brain className="h-4 w-4 text-blue-600" />
        }
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'insight': return <Zap className="h-4 w-4 text-purple-600" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    return time.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-[600px] shadow-lg border z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Notifications
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Real-time updates from your AI agents
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 animate-pulse" />
                    <span className="text-sm">Loading notifications...</span>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div 
                        className={`p-3 hover:bg-muted/50 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                          !notification.isRead ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1">
                            {getNotificationIcon(notification.type, notification.decision)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {notification.agentName}
                                  </Badge>
                                  {notification.confidence && (
                                    <Badge variant="secondary" className="text-xs">
                                      {notification.confidence}% confident
                                    </Badge>
                                  )}
                                  {notification.amount && (
                                    <Badge variant="outline" className="text-xs">
                                      {formatCurrency(notification.amount)}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View All Notifications
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Overlay to close notifications when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 