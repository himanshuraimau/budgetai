"use client"

import { useEffect } from "react"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { RecentRequestsTable } from "@/components/dashboard/recent-requests-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetProgress } from "@/components/ui/budget-progress"
import { useAuthStore, useCompanyStore, useRequestsStore } from "@/lib/store"

export default function EmployeeDashboardPage() {
  const { user } = useAuthStore()
  const { fetchCompany, fetchDepartments, departments } = useCompanyStore()
  const { fetchRequests } = useRequestsStore()

  useEffect(() => {
    fetchCompany()
    fetchDepartments()
    fetchRequests()
  }, [fetchCompany, fetchDepartments, fetchRequests])

  // Find user's department
  const userDepartment = departments.find((dept) => dept.id === user?.departmentId) || departments[0]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-8 p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your requests and department budget</p>
          </div>

          <Link href="/employee/request">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        <MetricCards isAdmin={false} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Recent Requests</h2>
            <RecentRequestsTable isAdmin={false} limit={5} />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Department Budget</h2>
            <Card>
              <CardHeader>
                <CardTitle>{userDepartment?.name || "Your Department"}</CardTitle>
                <CardDescription>Monthly budget and current spending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-lg font-medium">Budget Utilization</h3>
                    <span className="text-sm text-muted-foreground">
                      ${userDepartment?.currentSpent.toLocaleString()} of $
                      {userDepartment?.monthlyBudget.toLocaleString()}
                    </span>
                  </div>
                  <BudgetProgress
                    spent={userDepartment?.currentSpent || 0}
                    budget={userDepartment?.monthlyBudget || 1}
                    size="lg"
                  />
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-medium">Budget Guidelines</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Requests under $100 are typically auto-approved</li>
                    <li>Include detailed justification for requests over $500</li>
                    <li>Software purchases require manager approval</li>
                    <li>Travel expenses must be submitted 2 weeks in advance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
