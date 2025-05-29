"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, Zap, Shield, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const typewriterTexts = [
  "Find the perfect laptop for coding",
  "Discover trending fashion items",
  "Get personalized recommendations",
  "Compare prices instantly",
]

const floatingElements = [
  { icon: Sparkles, delay: 0, size: "w-6 h-6", color: "text-blue-300" },
  { icon: Zap, delay: 2, size: "w-5 h-5", color: "text-cyan-300" },
  { icon: Shield, delay: 4, size: "w-4 h-4", color: "text-sky-300" },
  { icon: Star, delay: 1, size: "w-5 h-5", color: "text-blue-200" },
]

export function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentText = typewriterTexts[currentTextIndex]

    if (isTyping) {
      if (displayText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentTextIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `hsl(${Math.random() * 30 + 190}, 70%, 70%)`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 6}s`,
            }}
          />
        ))}

        {/* Floating Icons */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.color} ${element.size} floating-animation opacity-20`}
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${element.delay}s`,
            }}
          >
            <element.icon className="w-full h-full" />
          </div>
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-full blur-3xl floating-delayed" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/25 to-teal-500/25 rounded-full blur-3xl floating-delayed-2" />
      </div>

      <div className="container relative px-6 py-24 mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 fade-in-up">
            <div className="inline-flex items-center glass-card px-6 py-3 text-sm font-medium text-white glow-effect">
              <Sparkles className="mr-2 h-4 w-4 text-blue-300" />
              Powered by Advanced AI
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-8 fade-in-up-delay-1">
            <h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight">
              Your Personal
              <br />
              <span className="text-gradient">AI Shopping</span>
              <br />
              Assistant
            </h1>
          </div>

          {/* Typewriter Effect */}
          <div className="mb-8 h-20 flex items-center justify-center fade-in-up-delay-2">
            <div className="glass-card px-8 py-4 rounded-2xl">
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {displayText}
                <span className="animate-pulse text-blue-300">|</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12 fade-in-up-delay-2">
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Experience the future of shopping with our AI assistant that understands your preferences, finds the best
              deals, and makes personalized recommendations just for you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 fade-in-up-delay-3">
            <Link href="/signup">
              <Button className="btn-primary px-8 py-4 text-lg rounded-full group">
                Start Shopping with AI
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button className="btn-glass px-8 py-4 text-lg rounded-full group">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto fade-in-up-delay-3">
            {[
              { number: "10M+", label: "Products Analyzed", icon: Sparkles },
              { number: "500K+", label: "Happy Customers", icon: Star },
              { number: "99.9%", label: "Uptime", icon: Shield },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl group hover:glow-effect transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-blue-300 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in-up-delay-3">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
