import mongoose from 'mongoose'

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

export interface IAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface IOrderItem {
  productId: string
  productTitle: string
  productImage: string
  quantity: number
  price: number
}

export interface IOrder {
  _id?: string
  id: string
  userId: string
  items: IOrderItem[]
  total: number
  currency: "USD" | "USDC"
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress: IAddress
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt?: Date
  updatedAt?: Date
}

const addressSchema = new mongoose.Schema<IAddress>({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    default: 'United States'
  }
}, { _id: false })

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  productId: {
    type: String,
    required: true
  },
  productTitle: {
    type: String,
    required: true,
    trim: true
  },
  productImage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  }
}, { _id: false })

const orderSchema = new mongoose.Schema<IOrder>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  items: [{
    type: orderItemSchema,
    required: true
  }],
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total must be positive']
  },
  currency: {
    type: String,
    enum: ['USD', 'USDC'],
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Create indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ paymentStatus: 1 })
orderSchema.index({ id: 1 })

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)
