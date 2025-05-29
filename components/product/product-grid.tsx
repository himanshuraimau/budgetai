"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/types/product"
import { ProductModal } from "./product-modal"

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-default bg-surface animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-primary mb-2">No products found</h3>
        <p className="text-secondary">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="border-default bg-surface hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <CardContent className="p-4">
              <div
                className="aspect-square rounded-lg overflow-hidden mb-4 bg-background"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2">
                <h3
                  className="font-semibold text-primary line-clamp-2 cursor-pointer hover:text-primary/80"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.title}
                </h3>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-secondary">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                <p className="text-sm text-secondary line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProduct(product)
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between pt-2 border-t border-default">
                  <span className="text-xs text-secondary">{product.seller.name}</span>
                  {product.seller.verified && <span className="text-xs text-green-600">✓ Verified</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  )
}
