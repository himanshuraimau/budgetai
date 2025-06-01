"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardRedirect() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    if (user) {
      if (!user.onboardingCompleted) {
        router.push("/onboarding?step=1")
        return
      }

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/employee/dashboard")
      }
    }
  }, [user, isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600 mb-4">BudgetAI</div>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return null
}
