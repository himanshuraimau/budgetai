import { cn } from "@/src/lib/utils"

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                currentStep > index
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : currentStep === index
                    ? "border-emerald-500 text-emerald-500"
                    : "border-gray-300 text-gray-300",
              )}
            >
              {currentStep > index ? (
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn("mt-2 text-xs font-medium", currentStep >= index ? "text-emerald-500" : "text-gray-500")}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full items-center justify-between">
        {steps.map((_, index) => {
          if (index === steps.length - 1) return null
          return (
            <div key={index} className={cn("h-1 flex-1", currentStep > index ? "bg-emerald-500" : "bg-gray-200")} />
          )
        })}
      </div>
    </div>
  )
}
