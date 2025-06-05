"use client"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { EnhancedPurchaseRequestForm } from "@/components/forms/enhanced-purchase-request-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetProgress } from "@/components/ui/budget-progress"
import { useEmployeeAPI } from "@/hooks/use-employee-api"

export default function RequestPage() {
  const { userDepartment, isDepartmentsLoading } = useEmployeeAPI()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-8 p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">New Purchase Request</h1>
          <p className="text-muted-foreground">
            Submit a purchase request for instant AI analysis and approval
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EnhancedPurchaseRequestForm />
          </div>

          <div className="space-y-6">
            {!isDepartmentsLoading && userDepartment && (
              <Card>
                <CardHeader>
                  <CardTitle>Department Budget</CardTitle>
                  <CardDescription>{userDepartment.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetProgress 
                    spent={userDepartment.currentSpent || 0} 
                    budget={userDepartment.monthlyBudget || 1} 
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm">
                  <li>Instant AI analysis of your request</li>
                  <li>Automatic approval for eligible requests</li>
                  <li>Real-time budget and policy validation</li>
                  <li>Immediate payment execution when approved</li>
                </ul>
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
                  <li>AI agents will process within seconds</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
