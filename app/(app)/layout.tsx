import type React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppRightPanel } from "@/components/layout/app-right-panel"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="flex max-w-7xl mx-auto">
          <AppSidebar />
          <main className="flex-1 border-x border-default min-h-screen">{children}</main>
          <AppRightPanel />
        </div>
      </div>
    </AuthGuard>
  )
}
