import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/lib/models/Product'
import { connectDB } from '@/lib/dbConnect'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { query, filters } = await request.json()
    
    // Build search filter
    const searchFilter: any = {}
    
    // Text search across title, description, and category
    if (query) {
      searchFilter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }
    
    // Category filter
    if (filters?.category) {
      searchFilter.category = filters.category
    }
    
    // Price range filter
    if (filters?.priceRange) {
      const priceRange = filters.priceRange
      let minPrice = 0
      let maxPrice = Number.POSITIVE_INFINITY
      
      if (priceRange.includes('Under')) {
        maxPrice = 100
      } else if (priceRange.includes('$100-$500')) {
        minPrice = 100
        maxPrice = 500
      } else if (priceRange.includes('$500-$1000')) {
        minPrice = 500
        maxPrice = 1000
      } else if (priceRange.includes('$1000+')) {
        minPrice = 1000
      }
      
      searchFilter.price = { $gte: minPrice, $lte: maxPrice }
    }
    
    // Brand filter (from seller name)
    if (filters?.brand) {
      searchFilter['seller.name'] = { $regex: filters.brand, $options: 'i' }
    }
    
    // Rating filter
    if (filters?.minRating) {
      searchFilter.rating = { $gte: parseFloat(filters.minRating) }
    }
    
    // Only show in-stock products
    searchFilter.inStock = true
    
    // Sorting
    let sort: any = { createdAt: -1 }
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_low':
          sort = { price: 1 }
          break
        case 'price_high':
          sort = { price: -1 }
          break
        case 'rating':
          sort = { rating: -1 }
          break
        case 'newest':
          sort = { createdAt: -1 }
          break
        case 'popularity':
          sort = { reviewCount: -1 }
          break
      }
    }
    
    // Execute search
    const products = await Product.find(searchFilter)
      .sort(sort)
      .limit(50) // Reasonable limit for search results
      .lean()
    
    // Transform specifications Map to object for JSON serialization
    const transformedProducts = products.map(product => ({
      ...product,
      specifications: Object.fromEntries(product.specifications || new Map())
    }))
    
    // Get available categories for filters
    const categories = await Product.distinct('category', { inStock: true })
    
    // Get price range statistics
    const priceStats = await Product.aggregate([
      { $match: { inStock: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ])
    
    return NextResponse.json({
      products: transformedProducts,
      totalResults: transformedProducts.length,
      filters: {
        categories: categories.sort(),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
      },
      searchQuery: query,
      appliedFilters: filters
    })
    
  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
