import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Order } from '@/lib/models/Order'
import { connectDB } from '@/lib/dbConnect'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Build filter
    const filter: any = { userId: session.user.email }
    
    if (status) {
      filter.status = status
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter)
    ])
    
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Orders API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    const orderData = await request.json()
    
    // Generate unique order ID
    const orderCount = await Order.countDocuments()
    const orderId = `ORD-${String(orderCount + 1).padStart(3, '0')}`
    
    // Calculate total
    const total = orderData.items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    )
    
    const order = new Order({
      id: orderId,
      userId: session.user.email,
      items: orderData.items,
      total,
      currency: orderData.currency || 'USD',
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: orderData.shippingAddress
    })
    
    await order.save()
    
    return NextResponse.json(order, { status: 201 })
    
  } catch (error) {
    console.error('Create Order Error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
