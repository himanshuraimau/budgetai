import type React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">ShopAI</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Auth Content */}
      <div className="relative w-full max-w-md px-4">{children}</div>
    </div>
  )
}
