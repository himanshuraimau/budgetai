"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingCart, CreditCard, Plus, Minus } from "lucide-react"
import type { Product } from "@/types/product"
import { CheckoutModal } from "@/components/checkout/checkout-modal"

interface AddToCartModalProps {
  product: Product
  quantity: number
  isOpen: boolean
  onClose: () => void
}

export function AddToCartModal({ product, quantity: initialQuantity, isOpen, onClose }: AddToCartModalProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [quantity, setQuantity] = useState(initialQuantity)

  const handleAddToCart = async () => {
    setIsAdding(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAdding(false)
    setIsAdded(true)

    // Auto close after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
      onClose()
    }, 2000)
  }

  const handleBuyNow = () => {
    setShowCheckout(true)
  }

  const total = product.price * quantity

  if (isAdded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Added to Cart!</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {quantity}x {product.title} has been added to your cart.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Continue Shopping
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">Add to Cart</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex space-x-4">
              <img
                src={product.images[0] || "/placeholder.svg?height=80&width=80"}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{product.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{product.description}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">${product.price}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 dark:text-slate-100">Quantity:</span>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Total:</span>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">${total.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={onClose} className="flex-1" disabled={isAdding}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>

                <Button onClick={handleBuyNow} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy Now - ${total.toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutModal
        product={product}
        quantity={quantity}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  )
}
