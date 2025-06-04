"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Users, Building } from "lucide-react"
import { useCompany } from "@/src/hooks/use-company"
import { useToast } from "@/src/hooks/use-toast"

export function CompanyInfo() {
  const { company, user, isLoading } = useCompany()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyJoinCode = async () => {
    if (company?.joinCode) {
      await navigator.clipboard.writeText(company.joinCode)
      setCopied(true)
      toast({
        title: "Join code copied!",
        description: "Share this code with employees to join your company.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No company information available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {company.name}
        </CardTitle>
        <CardDescription>
          {company.industry} • {company.size} employees
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.role === 'admin' && company.joinCode && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Company Join Code</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg font-mono tracking-wider px-3 py-1">
                {company.joinCode}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={copyJoinCode}
                className="h-8"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with employees so they can join your company
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
