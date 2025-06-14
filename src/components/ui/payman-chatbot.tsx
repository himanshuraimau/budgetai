"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Wallet,
  DollarSign,
  Users,
  Zap
} from "lucide-react"

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: any
}

interface PaymanChatbotProps {
  userContext?: {
    id?: string
    name?: string
    email?: string
  }
}

export function PaymanChatbot({ userContext }: PaymanChatbotProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: `Welcome to Payman Agent Testing${userContext?.name ? `, ${userContext.name}` : ''}! You can try commands like:\n\n• "what\'s my wallet balance?"\n• "list all payees"\n• "create a test payee named John with email john@test.com"\n• "send $50 to payee [id] for testing"\n• "list all wallets"`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Send to Payman testing endpoint
      const response = await fetch('/api/payman/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          userContext: userContext 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message to Payman agent')
      }

      const result = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response || 'No response received',
        timestamp: new Date(),
        metadata: result.metadata
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />
      case 'assistant': return <Bot className="h-4 w-4" />
      case 'system': return <Zap className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getMessageBgColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-primary text-primary-foreground ml-12'
      case 'assistant': return 'bg-muted mr-12'
      case 'system': return 'bg-blue-50 border border-blue-200 text-blue-800'
      default: return 'bg-gray-50'
    }
  }

  const quickCommands = [
    { label: "Check Balance", command: "what's my wallet balance?" },
    { label: "List Payees", command: "list all payees" },
    { label: "List Wallets", command: "list all wallets" },
    { label: "Create Test Payee", command: "create a test payee named TestUser with email test@example.com" }
  ]

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Wallet className="h-5 w-5 mr-2" />
            Payman Agent
          </Button>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
          <Card className="shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Payman Agent Tester
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                Connected to Payman SDK
                {userContext?.name && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {userContext.name}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Messages */}
              <ScrollArea className="h-80" ref={scrollAreaRef}>
                <div className="space-y-3 pr-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${getMessageBgColor(message.type)}`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {getMessageIcon(message.type)}
                        <div className="flex-1">
                          <div className="text-xs opacity-70 mb-1">
                            {message.type === 'user' ? 'You' : 
                             message.type === 'assistant' ? 'Payman Agent' : 'System'}
                          </div>
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs opacity-50">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bot className="h-4 w-4 animate-spin" />
                      Payman agent is thinking...
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Commands */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Quick Commands:</div>
                <div className="flex flex-wrap gap-1">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setInput(cmd.command)}
                    >
                      {cmd.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Payman agent anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Try natural language commands like "create a payee" or "check balance"
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
} 