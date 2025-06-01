import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { initializeDatabase, seedOrders } from '@/lib/seed'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Initialize products
    await initializeDatabase()
    
    // Seed orders for the current user
    await seedOrders(session.user.email)
    
    return NextResponse.json({ 
      message: 'Database initialized successfully',
      seeded: {
        products: true,
        orders: true,
        userId: session.user.email
      }
    })
    
  } catch (error) {
    console.error('Database Initialization Error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}
