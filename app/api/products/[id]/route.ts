import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/lib/models/Product'
import { connectDB } from '@/lib/dbConnect'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const product = await Product.findOne({ id: params.id }).lean()
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Transform specifications Map to object for JSON serialization
    const transformedProduct = {
      ...product,
      specifications: Object.fromEntries(product.specifications || new Map())
    }
    
    return NextResponse.json(transformedProduct)
    
  } catch (error) {
    console.error('Product Details API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const updateData = await request.json()
    
    const product = await Product.findOneAndUpdate(
      { id: params.id },
      updateData,
      { new: true, runValidators: true }
    ).lean()
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Transform specifications for response
    const transformedProduct = {
      ...product,
      specifications: Object.fromEntries(product.specifications || new Map())
    }
    
    return NextResponse.json(transformedProduct)
    
  } catch (error) {
    console.error('Update Product Error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const product = await Product.findOneAndDelete({ id: params.id })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
    
  } catch (error) {
    console.error('Delete Product Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
