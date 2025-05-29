import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="border-default bg-surface shadow-lg">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        <CardDescription className="text-secondary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  )
}
