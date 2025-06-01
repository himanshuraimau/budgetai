"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"
import { WelcomeStep } from "@/components/onboarding/welcome-step"
import { CompanySetupStep } from "@/components/onboarding/company-setup-step"
import { JoinCompanyStep } from "@/components/onboarding/join-company-step"
import { DepartmentSetupStep } from "@/components/onboarding/department-setup-step"
import { DepartmentAssignmentStep } from "@/components/onboarding/department-assignment-step"
import { PaymanStep } from "@/components/onboarding/payman-step"
import { CompletionStep } from "@/components/onboarding/completion-step"
import { useOnboardingStore, useAuthStore } from "@/lib/store"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = Number(searchParams.get("step") || "1")
  const { data } = useOnboardingStore()
  const { user } = useAuthStore()

  // Redirect if onboarding is already completed
  useEffect(() => {
    if (user?.onboardingCompleted) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/employee/dashboard")
      }
    }
  }, [user, router])

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
