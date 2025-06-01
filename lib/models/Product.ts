import mongoose from 'mongoose'

export interface ISeller {
  id: string
  name: string
  rating: number
  verified: boolean
}

export interface IProduct {
  _id?: string
  id: string
  title: string
  description: string
  price: number
  currency: "USD" | "USDC"
  images: string[]
  rating: number
  reviewCount: number
  seller: ISeller
  category: string
  inStock: boolean
  specifications: Record<string, string>
  createdAt?: Date
  updatedAt?: Date
}

const sellerSchema = new mongoose.Schema<ISeller>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { _id: false })

const productSchema = new mongoose.Schema<IProduct>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  currency: {
    type: String,
    enum: ['USD', 'USDC'],
    default: 'USD'
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  seller: {
    type: sellerSchema,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
})

// Create indexes for better search performance
productSchema.index({ title: 'text', description: 'text', category: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ inStock: 1 })

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)
