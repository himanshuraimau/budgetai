"use client"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { RecentRequestsTable } from "@/components/dashboard/recent-requests-table"
import { DepartmentCards } from "@/components/dashboard/department-cards"
import { DepartmentSpendingChart } from "@/components/dashboard/department-spending-chart"
import { CompanyInfo } from "@/components/dashboard/company-info"

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your company's budget and spending</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MetricCards isAdmin={true} />
          </div>
          <div>
            <CompanyInfo />
          </div>
        </div>

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
