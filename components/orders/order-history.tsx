"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"
import { OrderTrackingModal } from "./order-tracking-modal"

export function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

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
          <Button variant="outline" size="sm">
            Filter Orders
          </Button>
        </div>

        {mockOrders.map((order) => (
          <Card key={order.id} className="border-default bg-surface hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={order.image || "/placeholder.svg"}
                  alt={order.product}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{order.product}</h3>
                  <p className="text-sm text-secondary">Order #{order.id}</p>
                  <p className="text-sm text-muted">Ordered on {order.date}</p>
                  <p className="text-sm text-muted">Quantity: {order.quantity}</p>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-secondary">
                      {order.status === "delivered" ? "Delivered" : `Est. delivery: ${order.estimatedDelivery}`}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <p className="font-bold text-primary">${order.price}</p>
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
        ))}
      </div>

      <OrderTrackingModal orderId={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  )
}
