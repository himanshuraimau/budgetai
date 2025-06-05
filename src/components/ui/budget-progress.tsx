import { cn } from "@/lib/utils"

interface BudgetProgressProps {
  spent: number
  budget: number
  className?: string
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
}

export function BudgetProgress({ spent, budget, className, showLabels = true, size = "md" }: BudgetProgressProps) {
  const percentage = Math.min(Math.round((spent / budget) * 100), 100)

  const getProgressColor = () => {
    if (percentage < 60) return "bg-emerald-500"
    if (percentage < 85) return "bg-amber-500"
    return "bg-red-500"
  }

  const getHeightClass = () => {
    switch (size) {
      case "sm":
        return "h-1.5"
      case "lg":
        return "h-3"
      default:
        return "h-2"
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="mb-1 flex justify-between text-xs font-medium">
          <span>${spent.toLocaleString()}</span>
          <span>${budget.toLocaleString()}</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-gray-200", getHeightClass())}>
        <div className={cn("rounded-full", getProgressColor(), getHeightClass())} style={{ width: `${percentage}%` }} />
      </div>
      {showLabels && <div className="mt-1 text-xs text-gray-500">{percentage}% of budget used</div>}
    </div>
  )
}
