"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRequestsStore, useAuthStore, useCompanyStore } from "@/lib/store"
import type { RequestStatus } from "@/types"

export default function EmployeeRequestsPage() {
  const { user } = useAuthStore()
  const { requests, fetchRequests } = useRequestsStore()
  const { departments, fetchDepartments } = useCompanyStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
    fetchDepartments()
  }, [fetchRequests, fetchDepartments])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Filter requests to only show the current user's requests
  const userRequests = requests.filter((request) => request.employeeId === user?.id)

  // Filter requests based on search term and status
  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort by date, newest first
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">View and track your purchase requests</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRequests.map((request) => (
                <>
                  <TableRow
                    key={request.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpand(request.id)}
                  >
                    <TableCell>${request.amount.toLocaleString()}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{request.description}</TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>{formatDate(request.submittedAt)}</TableCell>
                  </TableRow>
                  {expandedId === request.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/50 p-4">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Department:</span>{" "}
                            {departments.find((d) => d.id === request.departmentId)?.name ||
                              `Department #${request.departmentId}`}
                          </div>
                          {request.justification && (
                            <div>
                              <span className="font-medium">Justification:</span> {request.justification}
                            </div>
                          )}
                          {request.aiDecisionReason && (
                            <div>
                              <span className="font-medium">Decision Reason:</span> {request.aiDecisionReason}
                            </div>
                          )}
                          {request.processedAt && (
                            <div>
                              <span className="font-medium">Processed:</span> {formatDate(request.processedAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}

              {sortedRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
