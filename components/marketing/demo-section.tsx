"use client"
import { Button } from "@/components/ui/button"
import { Send, User, Bot, Sparkles, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

const demoMessages = [
  { type: "user", content: "I need a new laptop for programming" },
  { type: "ai", content: "I'd be happy to help you find the perfect programming laptop! What's your budget range?" },
  { type: "user", content: "Around $1500-2000" },
  { type: "ai", content: "Great! Here are some excellent options in your budget:" },
]

export function DemoSection() {
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev < demoMessages.length) {
          return prev + 1
        }
        setTimeout(() => setVisibleMessages(0), 2000)
        return prev
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-6 mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-6">
            <MessageCircle className="mr-2 h-4 w-4 text-blue-300" />
            <span className="text-white/90 font-medium">See It In Action</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Watch ShopAI
            <span className="text-gradient"> Work </span>
            Its Magic
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Experience how our AI assistant helps you find exactly what you need through natural conversation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-3xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">ShopAI Assistant</h3>
                  <p className="text-sm text-white/60">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/60">Live Demo</span>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-6 mb-8 min-h-[300px]">
              {demoMessages.slice(0, visibleMessages).map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } animate-in slide-in-from-bottom-4 duration-500`}
                >
                  {message.type === "ai" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md ${message.type === "user" ? "order-first" : ""}`}>
                    <div
                      className={`px-6 py-4 rounded-2xl ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "glass-card text-white border border-white/20"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-white/50 mt-2 px-2">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {visibleMessages === demoMessages.length && (
                <div className="flex items-start space-x-4 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card px-6 py-4 rounded-2xl border border-white/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-4 p-4 glass-card rounded-2xl border border-white/20">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50 text-lg"
                disabled
              />
              <Button className="btn-primary rounded-full p-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link href="/signup">
              <Button className="btn-primary px-8 py-4 text-lg rounded-full group">
                Try It Yourself
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
