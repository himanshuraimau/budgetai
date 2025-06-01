"use client"

import { Building2, CreditCard, DollarSign, Users } from "lucide-react"
import { MetricCard } from "@/components/ui/metric-card"
import { useCompanyStore, useRequestsStore } from "@/lib/store"

interface MetricCardsProps {
  isAdmin?: boolean
}

export function MetricCards({ isAdmin = true }: MetricCardsProps) {
  const { departments } = useCompanyStore()
  const { requests } = useRequestsStore()

  // Calculate total budget and spent
  const totalBudget = departments.reduce((sum, dept) => sum + dept.monthlyBudget, 0)
  const totalSpent = departments.reduce((sum, dept) => sum + dept.currentSpent, 0)

  // Calculate pending requests
  const pendingRequests = requests.filter((req) => req.status === "pending").length

  // Employee count
  const employeeCount = departments.reduce((sum, dept) => sum + dept.employeeCount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Budget"
        value={`$${totalBudget.toLocaleString()}`}
        description="Monthly budget across all departments"
        icon={<DollarSign className="h-4 w-4" />}
      />

      <MetricCard
        title="Total Spent"
        value={`$${totalSpent.toLocaleString()}`}
        description={`${Math.round((totalSpent / totalBudget) * 100)}% of total budget`}
        icon={<CreditCard className="h-4 w-4" />}
        trend={{
          value: 12,
          isPositive: false,
        }}
      />

      {isAdmin ? (
        <>
          <MetricCard
            title="Departments"
            value={departments.length}
            description="Active departments"
            icon={<Building2 className="h-4 w-4" />}
          />

          <MetricCard
            title="Employees"
            value={employeeCount}
            description="Total team members"
            icon={<Users className="h-4 w-4" />}
          />
        </>
      ) : (
        <>
          <MetricCard
            title="Pending Requests"
            value={pendingRequests}
            description="Awaiting approval"
            icon={<CreditCard className="h-4 w-4" />}
          />

          <MetricCard
            title="Approved Requests"
            value={requests.filter((req) => req.status === "approved").length}
            description="This month"
            icon={<CreditCard className="h-4 w-4" />}
          />
        </>
      )}
    </div>
  )
}
