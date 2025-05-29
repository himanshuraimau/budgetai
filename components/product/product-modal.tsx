"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Share, Truck, Shield, RotateCcw } from "lucide-react"
import type { Product } from "@/types/product"
import { AddToCartModal } from "./add-to-cart-modal"

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showCartModal, setShowCartModal] = useState(false)

  const handleAddToCart = () => {
    setShowCartModal(true)
  }

  const handleBuyNow = () => {
    // Simulate purchase flow
    setShowCartModal(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{product.title}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-surface">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg?height=400&width=400"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-default"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg?height=64&width=64"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Price and Rating */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  {product.inStock ? (
                    <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-secondary">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-primary mb-2">Description</h3>
                <p className="text-secondary">{product.description}</p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-semibold text-primary mb-2">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-secondary">{key}:</span>
                      <span className="text-primary font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-secondary">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button onClick={handleBuyNow} variant="outline" className="flex-1" disabled={!product.inStock}>
                    Buy Now
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t border-default">
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <Shield className="w-4 h-4" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <RotateCcw className="w-4 h-4" />
                  <span>30-day return policy</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="p-4 bg-surface rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-primary">{product.seller.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-secondary ml-1">{product.seller.rating}</span>
                      </div>
                      {product.seller.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Store
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddToCartModal
        product={product}
        quantity={quantity}
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  )
}
