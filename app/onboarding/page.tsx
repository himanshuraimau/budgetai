"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"
import { WelcomeStep } from "@/components/onboarding/welcome-step"
import { CompanySetupStep } from "@/components/onboarding/company-setup-step"
import { JoinCompanyStep } from "@/components/onboarding/join-company-step"
import { DepartmentSetupStep } from "@/components/onboarding/department-setup-step"
import { DepartmentAssignmentStep } from "@/components/onboarding/department-assignment-step"
import { PaymanStep } from "@/components/onboarding/payman-step"
import { CompletionStep } from "@/components/onboarding/completion-step"
import { useOnboardingStore } from "@/lib/store"
import { useOnboardingAPI } from "@/hooks/use-onboarding-api"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = Number(searchParams.get("step") || "1")
  const { data: session, status } = useSession()
  const { data } = useOnboardingStore()
  const { userData, isLoadingUser } = useOnboardingAPI()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Redirect if onboarding is already completed
  useEffect(() => {
    if (userData?.onboardingCompleted) {
      if (userData.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/employee/dashboard")
      }
    }
  }, [userData, router])

  // Show loading while checking authentication and user data
  if (status === "loading" || isLoadingUser) {
    return (
      <OnboardingLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </OnboardingLayout>
    )
  }

  // Redirect if not authenticated
  if (!session?.user) {
    return null
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep />
      case 2:
        return data.userRole === "admin" ? <CompanySetupStep /> : <JoinCompanyStep />
      case 3:
        return data.userRole === "admin" ? <DepartmentSetupStep /> : <DepartmentAssignmentStep />
      case 4:
        return <PaymanStep />
      case 5:
        return <CompletionStep />
      default:
        return <WelcomeStep />
    }
  }

  return <OnboardingLayout>{renderStep()}</OnboardingLayout>
}
