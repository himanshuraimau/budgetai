import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/lib/models/Product'
import { connectDB } from '@/lib/dbConnect'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Build search filter
    const filter: any = {}
    
    // Text search
    if (query) {
      filter.$text = { $search: query }
    }
    
    // Category filter
    if (category) {
      filter.category = category
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }
    
    // Only show in-stock products
    filter.inStock = true
    
    // Build sort options
    let sort: any = {}
    switch (sortBy) {
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
      case 'relevance':
      default:
        if (query) {
          sort = { score: { $meta: 'textScore' } }
        } else {
          sort = { createdAt: -1 }
        }
        break
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Execute search with pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ])
    
    // Transform specifications Map to object for JSON serialization
    const transformedProducts = products.map(product => ({
      ...product,
      specifications: Object.fromEntries(product.specifications || new Map())
    }))
    
    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        query,
        category,
        minPrice,
        maxPrice,
        sortBy
      }
    })
    
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const productData = await request.json()
    
    // Generate unique product ID
    productData.id = `prod_${Date.now()}`
    
    const product = new Product(productData)
    await product.save()
    
    // Transform specifications for response
    const transformedProduct = {
      ...product.toObject(),
      specifications: Object.fromEntries(product.specifications || new Map())
    }
    
    return NextResponse.json(transformedProduct, { status: 201 })
    
  } catch (error) {
    console.error('Create Product Error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
