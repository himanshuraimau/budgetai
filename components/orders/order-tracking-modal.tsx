"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, MapPin } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"

interface OrderTrackingModalProps {
  orderId: string | null
  isOpen: boolean
  onClose: () => void
}

export function OrderTrackingModal({ orderId, isOpen, onClose }: OrderTrackingModalProps) {
  const order = mockOrders.find((o) => o.id === orderId)

  if (!order) return null

  const trackingSteps = [
    {
      status: "Order Confirmed",
      date: "Jan 22, 2024 - 2:30 PM",
      completed: true,
      icon: CheckCircle,
    },
    {
      status: "Processing",
      date: "Jan 23, 2024 - 9:15 AM",
      completed: order.status !== "confirmed",
      icon: Package,
    },
    {
      status: "Shipped",
      date: order.status === "shipped" || order.status === "delivered" ? "Jan 24, 2024 - 11:45 AM" : "Pending",
      completed: order.status === "shipped" || order.status === "delivered",
      icon: Truck,
    },
    {
      status: "Out for Delivery",
      date: order.status === "delivered" ? "Jan 25, 2024 - 8:30 AM" : "Pending",
      completed: order.status === "delivered",
      icon: MapPin,
    },
    {
      status: "Delivered",
      date: order.status === "delivered" ? "Jan 25, 2024 - 2:15 PM" : "Pending",
      completed: order.status === "delivered",
      icon: CheckCircle,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Tracking - #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="flex items-center space-x-4 p-4 bg-surface rounded-lg">
            <img
              src={order.image || "/placeholder.svg"}
              alt={order.product}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-primary">{order.product}</h3>
              <p className="text-sm text-secondary">Quantity: {order.quantity}</p>
              <p className="text-sm text-secondary">Total: ${order.price}</p>
            </div>
            <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="p-4 bg-surface rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Tracking Information</h4>
              <p className="text-sm text-secondary">Tracking Number: {order.trackingNumber}</p>
              <p className="text-sm text-secondary">Carrier: UPS</p>
              <p className="text-sm text-secondary">Estimated Delivery: {order.estimatedDelivery}</p>
            </div>
          )}

          {/* Tracking Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Tracking Timeline</h4>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? "text-primary" : "text-muted"}`}>{step.status}</p>
                    <p className="text-sm text-secondary">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
            <Button variant="outline" className="flex-1">
              View Invoice
            </Button>
            <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
