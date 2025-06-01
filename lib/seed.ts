import { Product } from '@/lib/models/Product'
import { Order } from '@/lib/models/Order'
import { mockProducts, mockOrders } from '@/lib/mock-data'
import dbConnect from '@/lib/dbConnect'

export async function seedProducts() {
    try {
        await dbConnect()

        // Clear existing products
        await Product.deleteMany({})

        // Insert mock products
        const products = await Product.insertMany(mockProducts)
        console.log(`✅ Seeded ${products.length} products`)

        return products
    } catch (error) {
        console.error('❌ Error seeding products:', error)
        throw error
    }
}

export async function seedOrders(userId: string) {
    try {
        await dbConnect()

        // Clear existing orders for this user
        await Order.deleteMany({ userId })

        // Transform mock orders to match the database schema
        const ordersToInsert = mockOrders.map(order => ({
            id: order.id,
            userId,
            items: [{
                productId: order.id.replace('ORD-', 'prod_'),
                productTitle: order.product,
                productImage: order.image,
                quantity: order.quantity,
                price: order.price
            }],
            total: order.price * order.quantity,
            currency: 'USD' as const,
            status: order.status,
            paymentStatus: order.status === 'delivered' ? 'completed' as const : 'pending' as const,
            shippingAddress: {
                street: '123 Main St',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94102',
                country: 'United States'
            },
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.estimatedDelivery,
            createdAt: new Date(order.date),
            updatedAt: new Date()
        }))

        const orders = await Order.insertMany(ordersToInsert)
        console.log(`✅ Seeded ${orders.length} orders for user ${userId}`)

        return orders
    } catch (error) {
        console.error('❌ Error seeding orders:', error)
        throw error
    }
}

export async function initializeDatabase() {
    try {
        await dbConnect()
        console.log('🚀 Initializing database...')

        // Seed products
        await seedProducts()

        console.log('✅ Database initialization complete')
    } catch (error) {
        console.error('❌ Database initialization failed:', error)
        throw error
    }
}
