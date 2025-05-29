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

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let results = mockProducts

    // Filter by search query
    if (query) {
      results = results.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filter by category
    if (filters.category) {
      results = results.filter((product) => product.category === filters.category)
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.includes("Under")
        ? [0, 100]
        : filters.priceRange.includes("$100-$500")
          ? [100, 500]
          : filters.priceRange.includes("$500-$1000")
            ? [500, 1000]
            : [1000, Number.POSITIVE_INFINITY]

      results = results.filter((product) => product.price >= min && product.price <= max)
    }

    setSearchResults(results)
    setIsLoading(false)
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
