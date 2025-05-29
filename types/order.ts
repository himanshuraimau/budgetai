export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

export interface Order {
  id: string
  userId: string
  products: OrderItem[]
  total: number
  currency: "USD" | "USDC"
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
  trackingNumber?: string
}

export interface OrderItem {
  productId: string
  product: import("./product").Product
  quantity: number
  price: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}
