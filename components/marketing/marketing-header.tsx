"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export function MarketingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "glass-nav" : "bg-transparent"}`}
    >
      <div className="container flex h-16 items-center justify-between px-6 mx-auto">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <ShoppingBag className="h-8 w-8 text-white group-hover:text-blue-200 transition-colors" />
            <Sparkles className="h-3 w-3 text-blue-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-2xl font-bold text-white">ShopAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-white/80 hover:text-white transition-colors font-medium">
            Features
          </Link>
          <Link href="#demo" className="text-white/80 hover:text-white transition-colors font-medium">
            Demo
          </Link>
          <Link href="#pricing" className="text-white/80 hover:text-white transition-colors font-medium">
            Pricing
          </Link>
          <Link href="#about" className="text-white/80 hover:text-white transition-colors font-medium">
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="btn-primary px-6 py-2 rounded-full">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 rounded-2xl">
          <nav className="flex flex-col space-y-4 p-6">
            <Link href="#features" className="text-white/80 hover:text-white transition-colors font-medium">
              Features
            </Link>
            <Link href="#demo" className="text-white/80 hover:text-white transition-colors font-medium">
              Demo
            </Link>
            <Link href="#pricing" className="text-white/80 hover:text-white transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#about" className="text-white/80 hover:text-white transition-colors font-medium">
              About
            </Link>
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full btn-primary rounded-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
