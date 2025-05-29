"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, CreditCard } from "lucide-react"
import type { Product } from "@/types/product"

interface PaymentProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  orderTotal: number
  product: Product
}

type PaymentStatus = "processing" | "approved" | "declined" | "pending"

export function PaymentProcessingModal({ isOpen, onClose, orderTotal, product }: PaymentProcessingModalProps) {
  const [status, setStatus] = useState<PaymentStatus>("processing")
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    if (isOpen) {
      setStatus("processing")
      setOrderId(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)

      // Simulate payment processing
      const timer = setTimeout(() => {
        // Random outcome: 80% approved, 10% pending, 10% declined
        const random = Math.random()
        if (random < 0.8) {
          setStatus("approved")
        } else if (random < 0.9) {
          setStatus("pending")
        } else {
          setStatus("declined")
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return {
          icon: CreditCard,
          title: "Processing Payment",
          message: "Please wait while we process your payment...",
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900",
          showSpinner: true,
        }
      case "approved":
        return {
          icon: CheckCircle,
          title: "Payment Approved!",
          message: "Your order has been confirmed and will be processed shortly.",
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900",
          showSpinner: false,
        }
      case "pending":
        return {
          icon: Clock,
          title: "Payment Pending",
          message: "Your payment is being reviewed. You'll receive an email update within 24 hours.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100 dark:bg-yellow-900",
          showSpinner: false,
        }
      case "declined":
        return {
          icon: XCircle,
          title: "Payment Declined",
          message: "Your payment was declined. Please check your payment information and try again.",
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900",
          showSpinner: false,
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center space-y-6 py-8">
          <div className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mx-auto`}>
            {config.showSpinner ? (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <config.icon className={`w-10 h-10 ${config.color}`} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{config.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{config.message}</p>
          </div>

          {status !== "processing" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=50&width=50"}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{product.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Order #{orderId}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Paid:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {status === "approved" && (
                  <>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Track Your Order</Button>
                    <Button variant="outline" onClick={onClose} className="w-full">
                      Continue Shopping
                    </Button>
                  </>
                )}

                {status === "pending" && (
                  <>
                    <Button variant="outline" onClick={onClose} className="w-full">
                      Got It
                    </Button>
                    <Button variant="ghost" className="w-full text-sm">
                      Contact Support
                    </Button>
                  </>
                )}

                {status === "declined" && (
                  <>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Try Again</Button>
                    <Button variant="outline" onClick={onClose} className="w-full">
                      Cancel Order
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
