"use client"

import { useState, Fragment } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { useAdminAPI } from "@/hooks/use-admin-api"
import { useEmployeeAPI } from "@/hooks/use-employee-api"
import { ArrowRight } from "lucide-react"

interface RecentRequestsTableProps {
  isAdmin?: boolean
  limit?: number
}

export function RecentRequestsTable({ isAdmin = true, limit = 5 }: RecentRequestsTableProps) {
  const adminAPI = useAdminAPI()
  const employeeAPI = useEmployeeAPI()
  
  const requests = isAdmin ? adminAPI.requests : employeeAPI.requests
  const updateRequestStatus = isAdmin ? adminAPI.updateRequestStatus : undefined
  const isRequestsLoading = isAdmin ? adminAPI.isRequestsLoading : employeeAPI.isRequestsLoading
  
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Sort by date, newest first
  const sortedRequests = [...requests]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, limit)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleApprove = async (id: string) => {
    if (isAdmin && updateRequestStatus) {
      await updateRequestStatus({ 
        id, 
        status: "approved", 
        aiDecisionReason: "Approved by admin" 
      })
    }
  }

  const handleDeny = async (id: string) => {
    if (isAdmin && updateRequestStatus) {
      await updateRequestStatus({ 
        id, 
        status: "denied", 
        aiDecisionReason: "Denied by admin" 
      })
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (isRequestsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading requests...</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
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
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRequests.map((request) => (
              <Fragment key={request.id}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(request.id)}
                >
                  <TableCell className="font-medium">
                    {/* In a real app, we'd fetch the employee name */}
                    Employee #{request.employeeId}
                  </TableCell>
                  <TableCell>
                    {/* In a real app, we'd fetch the department name */}
                    Department #{request.departmentId}
                  </TableCell>
                  <TableCell>${request.amount.toLocaleString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>{formatDate(request.submittedAt)}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeny(request.id)}
                          >
                            Deny
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
                {expandedId === request.id && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="bg-muted/50 p-4">
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
              </Fragment>
            ))}

            {sortedRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Link href={isAdmin ? "/admin/requests" : "/employee/requests"}>
          <Button variant="outline" size="sm">
            View All Requests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
