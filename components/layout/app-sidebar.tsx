"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { ShoppingBag, MessageSquare, Package, Settings, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

const navigation = [
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Search", href: "/search", icon: Search },
  { name: "Orders", href: "/orders", icon: Package },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col h-screen">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 mb-8">
        <ShoppingBag className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">ShopAI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-normal transition-all",
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
          <ThemeToggle />
        </div>

        {session?.user && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Account</span>
            <UserMenu />
          </div>
        )}
      </div>
    </div>
  )
}
