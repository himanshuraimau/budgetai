export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark"
  currency: "USD" | "USDC"
  notifications: boolean
}

export * from "./product"
export * from "./chat"
export * from "./order"
