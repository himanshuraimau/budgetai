"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { CheckCircle2, ArrowRight, Zap, Shield, TrendingUp, Users, DollarSign, Clock, Star, Play } from "lucide-react"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count}</span>
}

// Floating Background Elements
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}
    </div>
  )
}

// Dashboard Preview Component
function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateX: 25 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="relative mx-auto mt-16 max-w-4xl"
    >
      <div className="relative rounded-xl bg-white p-2 shadow-2xl ring-1 ring-gray-900/10">
        <div className="rounded-lg bg-gray-900 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="bg-emerald-500/20 rounded-lg p-3 h-16"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="bg-gray-800 rounded-lg p-4 h-32"
              />
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 }}
                className="bg-gray-800 rounded-lg p-4 h-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute -right-4 top-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
      >
        ✅ Request Approved!
      </motion.div>
    </motion.div>
  )
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50"
      >
        <div className="container flex h-16 items-center justify-between py-4">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              BudgetAI
            </span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="hover:bg-emerald-50">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20 md:py-32">
          <FloatingElements />

          <div className="container relative">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                variants={fadeInUp}
                className="mb-6 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                AI-Powered Budget Management
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
              >
                Smart Budget Management for{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Modern Teams
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
                Streamline your company's spending with intelligent budget management. Automate approvals, track
                expenses in real-time, and gain actionable insights with our AI-powered assistant.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-emerald-50">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <DashboardPreview />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: "Companies Trust Us", value: 500, suffix: "+" },
                { label: "Requests Processed", value: 50000, suffix: "+" },
                { label: "Average Approval Time", value: 2, suffix: " min" },
                { label: "Cost Savings", value: 30, suffix: "%" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage budgets</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to streamline your budget management process
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: Zap,
                  title: "AI-Powered Approvals",
                  description:
                    "Intelligent request approvals based on budget rules, spending patterns, and company policies.",
                  color: "emerald",
                },
                {
                  icon: TrendingUp,
                  title: "Real-time Analytics",
                  description:
                    "Get instant insights into spending patterns, budget utilization, and cost optimization opportunities.",
                  color: "blue",
                },
                {
                  icon: Shield,
                  title: "Smart Budget Controls",
                  description:
                    "Automated spending limits, approval workflows, and compliance monitoring to prevent overspending.",
                  color: "purple",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description:
                    "Seamless collaboration between departments with role-based permissions and notifications.",
                  color: "orange",
                },
                {
                  icon: Clock,
                  title: "Instant Processing",
                  description: "Lightning-fast request processing with automated approvals for routine purchases.",
                  color: "green",
                },
                {
                  icon: DollarSign,
                  title: "Cost Optimization",
                  description: "AI-driven recommendations to optimize spending and identify cost-saving opportunities.",
                  color: "red",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4`}
                      >
                        <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Streamline your budget process in minutes, not hours
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Transform your budget management with AI-powered automation that saves time, reduces errors, and
                  provides real-time insights.
                </p>

                <div className="space-y-4">
                  {[
                    "Reduce approval time by 90%",
                    "Eliminate manual budget tracking",
                    "Get real-time spending insights",
                    "Automate compliance monitoring",
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    >
                      Get Started Today
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium">New laptop request</div>
                            <div className="text-sm text-gray-500">$1,200 • Engineering</div>
                          </div>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1, type: "spring" }}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          Auto-approved
                        </motion.div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Team lunch</div>
                            <div className="text-sm text-gray-500">$150 • Marketing</div>
                          </div>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2, type: "spring" }}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          Approved
                        </motion.div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Conference tickets</div>
                            <div className="text-sm text-gray-500">$2,500 • Sales</div>
                          </div>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.4, type: "spring" }}
                          className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          Pending review
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by teams worldwide</h2>
              <p className="text-lg text-gray-600">See what our customers have to say about BudgetAI</p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  quote:
                    "BudgetAI reduced our approval time from days to minutes. The AI is incredibly smart and learns our spending patterns.",
                  author: "Sarah Chen",
                  role: "CFO at TechCorp",
                  rating: 5,
                },
                {
                  quote:
                    "The real-time insights have helped us optimize our budget allocation and save 25% on operational costs.",
                  author: "Michael Rodriguez",
                  role: "Finance Director at StartupXYZ",
                  rating: 5,
                },
                {
                  quote:
                    "Finally, a budget management tool that actually understands our business needs. Highly recommended!",
                  author: "Emily Johnson",
                  role: "Operations Manager at GrowthCo",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 mb-4">"{testimonial.quote}"</blockquote>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your budget management?</h2>
              <p className="text-xl mb-8 text-emerald-100">Join thousands of companies already using BudgetAI</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg border-white text-emerald-700 hover:bg-white hover:text-emerald-600"
                  >
                    Schedule Demo
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  BudgetAI
                </span>
              </div>
              <p className="text-gray-600 mb-4">AI-powered budget management for modern teams.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© {new Date().getFullYear()} BudgetAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-emerald-600">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-600">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
