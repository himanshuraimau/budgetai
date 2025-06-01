import { useState, useEffect } from 'react'

interface Product {
  _id?: string
  id: string
  title: string
  description: string
  price: number
  currency: "USD" | "USDC"
  images: string[]
  rating: number
  reviewCount: number
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  category: string
  inStock: boolean
  specifications: Record<string, string>
}

interface SearchFilters {
  category?: string
  priceRange?: string
  brand?: string
  minRating?: number
  sortBy?: string
}

interface SearchResponse {
  products: Product[]
  totalResults: number
  filters: {
    categories: string[]
    priceRange: {
      minPrice: number
      maxPrice: number
      avgPrice: number
    }
  }
  searchQuery: string
  appliedFilters: SearchFilters
}

export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchProducts = async (query: string, filters: SearchFilters = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, filters }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data: SearchResponse = await response.json()
      setProducts(data.products)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getProducts = async (params: Record<string, string> = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams(params)
      const response = await fetch(`/api/products?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    products,
    isLoading,
    error,
    searchProducts,
    getProducts,
  }
}

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
    }
  }, [productId])

  const fetchProduct = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${id}`)

      if (!response.ok) {
        throw new Error('Product not found')
      }

      const data = await response.json()
      setProduct(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product'
      setError(errorMessage)
      setProduct(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    product,
    isLoading,
    error,
    refetch: () => productId && fetchProduct(productId),
  }
}
