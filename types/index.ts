export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark"
  currency: "USD" | "USDC"
  notifications: boolean
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

