"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboardingStore } from "@/lib/store"
import type { UserRole } from "@/types"

export function WelcomeStep() {
  const { data, setUserRole } = useOnboardingStore()

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Budget Manager AI!</h1>
        <p className="mt-2 text-muted-foreground">Let's get you set up with your account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            data.userRole === "admin" ? "border-emerald-500 ring-1 ring-emerald-500" : ""
          }`}
          onClick={() => handleRoleSelect("admin")}
        >
          <CardHeader>
            <CardTitle>Company Admin</CardTitle>
            <CardDescription>Set up your company, manage departments and budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>Create and manage departments</li>
              <li>Set and adjust budgets</li>
              <li>Review purchase requests</li>
              <li>View company-wide spending analytics</li>
            </ul>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            data.userRole === "employee" ? "border-emerald-500 ring-1 ring-emerald-500" : ""
          }`}
          onClick={() => handleRoleSelect("employee")}
        >
          <CardHeader>
            <CardTitle>Employee</CardTitle>
            <CardDescription>Join your company and submit purchase requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>Submit purchase requests</li>
              <li>Track your spending history</li>
              <li>View department budget status</li>
              <li>Get instant AI-powered approvals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
