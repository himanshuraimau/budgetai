import { Schema, model, models, Document } from "mongoose"
import type { ChatMessage, ChatSession, MessageType, MessageContentType } from "@/types/chat"
import type { ProductCard } from "@/types/product"

export interface IChatMessage extends Document {
  id: string
  type: MessageType
  contentType: MessageContentType
  content: string
  timestamp: Date
  products?: ProductCard[]
  orderId?: string
  metadata?: Record<string, unknown>
}

export interface IChatSession extends Document {
  id: string
  userId: string
  messages: IChatMessage[]
  createdAt: Date
  updatedAt: Date
}

const ProductCardSchema = new Schema({
  product: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ["USD", "USDC"], default: "USD" },
    images: [{ type: String }],
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    seller: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      verified: { type: Boolean, default: false },
    },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    specifications: { type: Schema.Types.Mixed },
  },
  reason: { type: String },
}, { _id: false })

const ChatMessageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ["user", "ai", "system"], required: true },
  contentType: { type: String, enum: ["text", "product", "order", "payment"], default: "text" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  products: [ProductCardSchema],
  orderId: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, { _id: false })

const ChatSessionSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  messages: [ChatMessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Update the updatedAt field on every save
ChatSessionSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Add indexes for better query performance (removing unique: true to avoid duplication)
ChatSessionSchema.index({ id: 1 }, { unique: true })
ChatSessionSchema.index({ userId: 1, updatedAt: -1 })

export const ChatSessionModel = models.ChatSession || model<IChatSession>("ChatSession", ChatSessionSchema)
