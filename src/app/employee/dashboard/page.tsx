"use client"

import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetProgress } from "@/components/ui/budget-progress"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEmployeeAPI } from "@/hooks/use-employee-api"

export default function EmployeeDashboardPage() {
  const { 
    requests, 
    userDepartment,
    pendingRequestsCount,
    approvedRequestsCount,
    deniedRequestsCount,
    thisMonthAmount,
    isRequestsLoading,
    isDepartmentsLoading
  } = useEmployeeAPI()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get recent requests (last 5)
  const recentRequests = requests
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8 p-8">
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

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequestsCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequestsCount}</div>
              <p className="text-xs text-muted-foreground">Successfully approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deniedRequestsCount}</div>
              <p className="text-xs text-muted-foreground">Requests denied</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${thisMonthAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total requested</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Recent Requests</h2>
            {isRequestsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading requests...</div>
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>${request.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                        <TableCell>{formatDate(request.submittedAt)}</TableCell>
                      </TableRow>
                    ))}
                    {recentRequests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No requests found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
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
      </div>
  )
}
