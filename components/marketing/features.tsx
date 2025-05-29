"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Brain, Search, Shield, TrendingUp, MessageSquare, Truck, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description: "Our advanced AI learns your preferences and suggests products you'll love.",
    color: "from-blue-500 to-cyan-500",
    accent: "text-blue-300",
  },
  {
    icon: Search,
    title: "Smart Product Search",
    description: "Find exactly what you need with natural language search and filters.",
    color: "from-cyan-500 to-teal-500",
    accent: "text-cyan-300",
  },
  {
    icon: MessageSquare,
    title: "Conversational Shopping",
    description: "Chat naturally with our AI to discover and compare products.",
    color: "from-sky-500 to-blue-500",
    accent: "text-sky-300",
  },
  {
    icon: TrendingUp,
    title: "Price Tracking",
    description: "Get alerts when prices drop on items you're watching.",
    color: "from-blue-600 to-indigo-500",
    accent: "text-blue-300",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Shop safely with encrypted transactions and fraud protection.",
    color: "from-teal-500 to-green-500",
    accent: "text-teal-300",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your orders delivered quickly with real-time tracking.",
    color: "from-cyan-600 to-blue-600",
    accent: "text-cyan-300",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-6 mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-6">
            <Sparkles className="mr-2 h-4 w-4 text-blue-300" />
            <span className="text-white/90 font-medium">Why Choose ShopAI?</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Experience the
            <span className="text-gradient"> Future </span>
            of Shopping
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Discover features designed to make your shopping experience effortless, intelligent, and delightful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card group hover:glow-effect transition-all duration-500 hover:-translate-y-2 border-0 bg-transparent"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className="mt-6 flex items-center">
                  <div className={`w-8 h-1 bg-gradient-to-r ${feature.color} rounded-full`} />
                  <Zap
                    className={`ml-2 w-4 h-4 ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="glass-card inline-block p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
            <p className="text-white/70 mb-6">Join thousands of smart shoppers today.</p>
            <Link href="/signup">
              <Button className="btn-primary px-8 py-3 rounded-full">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
