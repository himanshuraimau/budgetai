"use client"

import { useSession } from "next-auth/react"
import type { User } from "@/types"

export function useAuth() {
  const { data: session, status } = useSession()

  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role as "admin" | "employee",
    companyId: session.user.companyId,
    departmentId: session.user.departmentId,
    onboardingCompleted: session.user.onboardingCompleted,
  } : null

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  }
}
