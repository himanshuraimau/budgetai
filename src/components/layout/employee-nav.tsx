"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Plus, 
  List 
} from "lucide-react"

interface EmployeeNavProps {
  className?: string
}

export function EmployeeNav({ className }: EmployeeNavProps) {
  const pathname = usePathname()

  const employeeRoutes = [
    { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employee/request", label: "New Request", icon: Plus },
    { href: "/employee/requests", label: "My Requests", icon: List },
  ]

  return (
    <nav className={cn("flex items-center space-x-2", className)}>
      {employeeRoutes.map((route) => {
        const Icon = route.icon
        const isActive = pathname === route.href
        
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              "hover:bg-muted/80 hover:text-foreground",
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline-block lg:inline-block">{route.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
