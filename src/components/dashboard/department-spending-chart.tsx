"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminAPI } from "@/hooks/use-admin-api"

// Note: In a real app, we would use a proper charting library like Chart.js or Recharts
// This is a simplified version for demonstration purposes

export function DepartmentSpendingChart() {
  const { departments, isDepartmentsLoading } = useAdminAPI()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const barWidth = width / (departments.length * 2)
    const spacing = barWidth

    // Find max budget for scaling
    const maxBudget = Math.max(...departments.map((d) => d.monthlyBudget))

    // Draw bars
    departments.forEach((dept, index) => {
      const x = index * (barWidth + spacing) + spacing

      // Budget bar (full height)
      const budgetHeight = (dept.monthlyBudget / maxBudget) * (height - 40)
      ctx.fillStyle = "#e2e8f0" // slate-200
      ctx.fillRect(x, height - budgetHeight - 20, barWidth, budgetHeight)

      // Spent bar
      const spentHeight = (dept.currentSpent / maxBudget) * (height - 40)
      ctx.fillStyle = "#10b981" // emerald-500
      ctx.fillRect(x, height - spentHeight - 20, barWidth, spentHeight)

      // Department name
      ctx.fillStyle = "#64748b" // slate-500
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(dept.name.substring(0, 10), x + barWidth / 2, height - 5)
    })
  }, [departments])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Spending</CardTitle>
        <CardDescription>Monthly budget utilization by department</CardDescription>
      </CardHeader>
      <CardContent>
        {isDepartmentsLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <canvas ref={canvasRef} width={500} height={300} className="h-full w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
