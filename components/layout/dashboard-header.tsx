"use client"

import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { useAuthStore, useCompanyStore } from "@/lib/store"

export function DashboardHeader() {
  const { user } = useAuthStore()
  const { company } = useCompanyStore()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-emerald-600">BudgetAI</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-sm text-muted-foreground md:block">
            {user?.role === "admin" ? company?.name : `${company?.name} • ${user?.role}`}
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
