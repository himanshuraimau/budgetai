"use client"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PurchaseRequestForm } from "@/components/forms/purchase-request-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetProgress } from "@/components/ui/budget-progress"
import { useEmployeeAPI } from "@/hooks/use-employee-api"

export default function NewRequestPage() {
  const { userDepartment, isDepartmentsLoading } = useEmployeeAPI()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Purchase Request</h1>
          <p className="text-muted-foreground">Submit a new purchase request for approval</p>
        </div>

        {isDepartmentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading department information...</div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PurchaseRequestForm />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Budget</CardTitle>
                  <CardDescription>{userDepartment?.name || "Your Department"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetProgress spent={userDepartment?.currentSpent || 0} budget={userDepartment?.monthlyBudget || 1} />
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm">
                  <li>Provide a clear, specific description</li>
                  <li>Include justification for purchases over $500</li>
                  <li>Select the most appropriate category</li>
                  <li>Requests are reviewed by AI and may be auto-approved based on department rules</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </main>
    </div>
  )
}
