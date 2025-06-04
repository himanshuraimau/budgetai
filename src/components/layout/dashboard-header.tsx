"use client"

import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { useSession } from "next-auth/react"
import { useAdminAPI } from "@/src/hooks/use-admin-api"

export function DashboardHeader() {
  const { data: session } = useSession()
  const { company } = useAdminAPI()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm md:text-lg">
              B
            </div>
            <span className="text-lg md:text-2xl font-bold text-emerald-600">BudgetAI</span>
          </Link>
          <div className="hidden sm:block">
            <MainNav />
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden text-sm text-muted-foreground lg:flex lg:flex-col lg:items-end">
            {company?.name && (
              <span className="font-medium text-foreground">{company.name}</span>
            )}
            {session?.user?.role && (
              <span className="text-xs capitalize">{session.user.role}</span>
            )}
          </div>
          <UserNav />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="sm:hidden border-t bg-background/95 backdrop-blur px-4 py-3">
        <MainNav className="justify-center" />
      </div>
    </header>
  )
}
