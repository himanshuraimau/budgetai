import { create } from 'zustand'
import { signIn, signOut, useSession } from 'next-auth/react'

interface AuthState {
  isLoading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: false,
  error: null,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        set({ error: 'Invalid email or password', isLoading: false })
        return false
      }
      
      set({ isLoading: false })
      return true
    } catch (error) {
      set({ error: 'Login failed. Please try again.', isLoading: false })
      return false
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        set({ error: data.error || 'Registration failed', isLoading: false })
        return false
      }
      
      // After successful registration, automatically sign in the user
      const loginResult = await get().login(email, password)
      return loginResult
    } catch (error) {
      set({ error: 'Registration failed. Please try again.', isLoading: false })
      return false
    }
  },
  
  logout: async () => {
    set({ isLoading: true })
    try {
      await signOut({ redirect: false })
      set({ isLoading: false, error: null })
    } catch (error) {
      set({ isLoading: false, error: 'Logout failed' })
    }
  },
}))
