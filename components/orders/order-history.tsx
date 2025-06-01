"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Eye, Loader2 } from "lucide-react"
import { OrderTrackingModal } from "./order-tracking-modal"
import { useToast } from "@/hooks/use-toast"

interface Order {
  _id: string
  id: string
  items: Array<{
    productId: string
    productTitle: string
    productImage: string
    quantity: number
    price: number
  }>
  total: number
  currency: string
  status: string
  createdAt: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "shipped":
        return <Truck className="w-3 h-3 mr-1" />
      case "processing":
        return <Package className="w-3 h-3 mr-1" />
      case "confirmed":
        return <Clock className="w-3 h-3 mr-1" />
      default:
        return <Package className="w-3 h-3 mr-1" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "confirmed":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Order History</h2>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={fetchOrders} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border-default bg-surface hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={order.items[0]?.productImage || "/placeholder.svg"}
                    alt={order.items[0]?.productTitle}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">
                      {order.items[0]?.productTitle}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </h3>
                    <p className="text-sm text-secondary">Order #{order.id}</p>
                    <p className="text-sm text-muted">Ordered on {formatDate(order.createdAt)}</p>
                    <p className="text-sm text-muted">
                      Total quantity: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-sm text-secondary">
                        {order.status === "delivered" ? "Delivered" : `Est. delivery: ${order.estimatedDelivery}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold text-primary">${order.total}</p>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order.id)}>
                        <Eye className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <OrderTrackingModal orderId={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  )
}
