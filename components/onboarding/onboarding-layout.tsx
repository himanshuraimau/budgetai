"use client"

import type { ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/lib/store"

interface OnboardingLayoutProps {
  children: ReactNode
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = Number(searchParams.get("step") || "1")

  const { data, setStep } = useOnboardingStore()

  const steps = [
    "Welcome",
    data.userRole === "admin" ? "Company" : "Join",
    data.userRole === "admin" ? "Departments" : "Department",
    "Payman",
    "Complete",
  ]

  const handleNext = () => {
    if (step < steps.length) {
      const nextStep = step + 1
      setStep(nextStep as any)
      router.push(`/onboarding?step=${nextStep}`)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1
      setStep(prevStep as any)
      router.push(`/onboarding?step=${prevStep}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-lg">
        <ProgressSteps steps={steps} currentStep={step - 1} className="mb-8" />

        <div className="mb-8">{children}</div>

        <div className="flex justify-between">
          {step > 1 && step < steps.length && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step === 1 && <div />}

          {step < steps.length && (
            <Button onClick={handleNext}>{step === steps.length - 1 ? "Complete" : "Continue"}</Button>
          )}
        </div>
      </div>
    </div>
  )
}
