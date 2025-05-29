"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductSearchProps {
  onSearch: (query: string, filters: any) => void
}

export function ProductSearch({ onSearch }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)

  const categories = ["Electronics", "Audio", "Wearables", "Computers", "Phones"]
  const priceRanges = ["Under $100", "$100-$500", "$500-$1000", "$1000+"]

  const handleSearch = () => {
    onSearch(searchQuery, {
      category: selectedCategory,
      priceRange: priceRange,
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Price
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Price Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPriceRange(null)}>Any Price</DropdownMenuItem>
            {priceRanges.map((range) => (
              <DropdownMenuItem key={range} onClick={() => setPriceRange(range)}>
                {range}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters */}
        {selectedCategory && (
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory(null)}>
            {selectedCategory} ×
          </Badge>
        )}
        {priceRange && (
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange(null)}>
            {priceRange} ×
          </Badge>
        )}
      </div>
    </div>
  )
}
