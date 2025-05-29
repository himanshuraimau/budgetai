"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import type { ProductCard as ProductCardType } from "@/types/product"
import { ProductModal } from "@/components/product/product-modal"

interface ProductCardProps {
  productCard: ProductCardType
}

export function ProductCard({ productCard }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { product, reason } = productCard

  return (
    <>
      <Card className="border-default bg-background hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex space-x-3" onClick={() => setIsModalOpen(true)}>
            <img
              src={product.images[0] || "/placeholder.svg?height=80&width=80"}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-primary text-sm truncate">{product.title}</h3>
              <p className="text-xs text-secondary mt-1 line-clamp-2">{product.description}</p>

              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-secondary ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-muted ml-2">({product.reviewCount})</span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-primary">${product.price}</span>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsModalOpen(true)
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {reason && <div className="mt-3 p-2 bg-primary/10 rounded text-xs text-primary">💡 {reason}</div>}
        </CardContent>
      </Card>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
