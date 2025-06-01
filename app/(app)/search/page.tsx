"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { ProductSearch } from "@/components/product/product-search"
import { ProductGrid } from "@/components/product/product-grid"
import { mockProducts } from "@/lib/mock-data"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (query: string, filters: any) => {
    setIsLoading(true)

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

      const data = await response.json()
      setSearchResults(data.products)
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock data on error
      setSearchResults(mockProducts)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Search Products" />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ProductSearch onSearch={handleSearch} />
        <ProductGrid products={searchResults} isLoading={isLoading} />
      </div>
    </div>
  )
}
