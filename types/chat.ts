export type MessageType = "user" | "ai" | "system"
export type MessageContentType = "text" | "product" | "order" | "payment"

export interface ChatMessage {
  id: string
  type: MessageType
  contentType: MessageContentType
  content: string
  timestamp: Date
  products?: import("./product").ProductCard[]
  orderId?: string
  metadata?: Record<string, unknown>
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}
