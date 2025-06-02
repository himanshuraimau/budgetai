"use client"

import React, { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminAPI } from "@/hooks/use-admin-api"
import { RequestStatus } from "@/types"

export default function AdminRequestsPage() {
  const { 
    requests, 
    departments, 
    updateRequestStatus, 
    isRequestsLoading, 
    isDepartmentsLoading,
    isUpdatingRequestStatus 
  } = useAdminAPI()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleApprove = async (id: string) => {
    try {
      await updateRequestStatus({ id, status: "approved", aiDecisionReason: "Approved by admin" })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleDeny = async (id: string) => {
    try {
      await updateRequestStatus({ id, status: "denied", aiDecisionReason: "Denied by admin" })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Filter requests based on search term, status, and department
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || request.departmentId === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
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
          <h1 className="text-3xl font-bold">Purchase Requests</h1>
          <p className="text-muted-foreground">Manage and review all purchase requests</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
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

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isRequestsLoading || isDepartmentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading requests...</div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(request.id)}
                    >
                      <TableCell className="font-medium">
                        Employee #{request.employeeId}
                      </TableCell>
                      <TableCell>
                        {departments.find((d) => d.id === request.departmentId)?.name ||
                          `Department #${request.departmentId}`}
                      </TableCell>
                      <TableCell>${request.amount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>{formatDate(request.submittedAt)}</TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                              onClick={() => handleApprove(request.id)}
                              disabled={isUpdatingRequestStatus}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDeny(request.id)}
                              disabled={isUpdatingRequestStatus}
                            >
                              Deny
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedId === request.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/50 p-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Category:</span> {request.category}
                            </div>
                            {request.justification && (
                              <div>
                                <span className="font-medium">Justification:</span> {request.justification}
                              </div>
                            )}
                            {request.aiDecisionReason && (
                              <div>
                                <span className="font-medium">AI Decision:</span> {request.aiDecisionReason}
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
                  </React.Fragment>
                ))}

                {sortedRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
