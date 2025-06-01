"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const isAdmin = user?.role === "admin"
  const isEmployee = user?.role === "employee"

  const adminRoutes = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/departments", label: "Departments" },
    { href: "/admin/requests", label: "Requests" },
  ]

  const employeeRoutes = [
    { href: "/employee/dashboard", label: "Dashboard" },
    { href: "/employee/request", label: "New Request" },
    { href: "/employee/requests", label: "My Requests" },
  ]

  const routes = isAdmin ? adminRoutes : isEmployee ? employeeRoutes : []

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === route.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
