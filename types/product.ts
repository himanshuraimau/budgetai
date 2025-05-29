export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: "USD" | "USDC"
  images: string[]
  rating: number
  reviewCount: number
  seller: Seller
  category: string
  inStock: boolean
  specifications: Record<string, string>
}

export interface Seller {
  id: string
  name: string
  rating: number
  verified: boolean
}

export interface ProductCard {
  product: Product
  reason?: string
}
