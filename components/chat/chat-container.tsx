"use client"

import { useState, useRef, useEffect } from "react"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { mockChatMessages, getAIResponse } from "@/lib/mock-data"

export function ChatContainer() {
  const [messages, setMessages] = useState(mockChatMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      type: "user" as const,
      contentType: "text" as const,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    // Show typing indicator
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(
      async () => {
        const aiResponse = await getAIResponse(content)
        setIsTyping(false)
        setMessages((prev) => [...prev, aiResponse])
      },
      1500 + Math.random() * 1000,
    ) // Random delay between 1.5-2.5s
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
