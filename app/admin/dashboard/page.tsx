"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { RecentRequestsTable } from "@/components/dashboard/recent-requests-table"
import { DepartmentCards } from "@/components/dashboard/department-cards"
import { DepartmentSpendingChart } from "@/components/dashboard/department-spending-chart"
import { useCompanyStore, useRequestsStore } from "@/lib/store"

export default function AdminDashboardPage() {
  const { fetchCompany, fetchDepartments } = useCompanyStore()
  const { fetchRequests } = useRequestsStore()

  useEffect(() => {
    fetchCompany()
    fetchDepartments()
    fetchRequests()
  }, [fetchCompany, fetchDepartments, fetchRequests])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your company's budget and spending</p>
        </div>

        <MetricCards isAdmin={true} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Recent Requests</h2>
              <RecentRequestsTable isAdmin={true} limit={5} />
            </div>

            <DepartmentSpendingChart />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Departments</h2>
            <DepartmentCards />
          </div>
        </div>
      </main>
    </div>
  )
}
