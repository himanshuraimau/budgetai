"use client"

import { useState, useRef, useEffect } from "react"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { useChatStore } from "@/lib/store/chat"
import { useSendMessage, useChatSessions } from "@/hooks/use-chat"
import type { ChatMessage } from "@/types/chat"

// Mock user ID - in a real app, this would come from auth
const MOCK_USER_ID = "user_demo_123"

export function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Zustand store
  const {
    currentSession,
    setCurrentSession,
    setSessions,
    addMessage,
    isTyping,
    setTyping,
    error,
    setError,
    clearError,
    createNewSession,
  } = useChatStore()
  
  // React Query hooks
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions(MOCK_USER_ID)
  const sendMessageMutation = useSendMessage()

  // Initialize sessions when loaded
  useEffect(() => {
    if (sessions) {
      setSessions(sessions)
      
      // If no current session and we have sessions, select the most recent one
      if (!currentSession && sessions.length > 0) {
        setCurrentSession(sessions[0])
      }
      
      // If no sessions exist, create a new one with a welcome message
      if (sessions.length === 0 && !currentSession) {
        const newSession = createNewSession(MOCK_USER_ID)
        const welcomeMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: "ai",
          contentType: "text",
          content: "Hi! I'm your AI shopping assistant. I can help you find the perfect products, compare prices, and make personalized recommendations. What are you looking for today?",
          timestamp: new Date(),
        }
        addMessage(welcomeMessage)
      }
    }
  }, [sessions, currentSession, setSessions, setCurrentSession, createNewSession, addMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages, isTyping])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return
    
    clearError()
    
    try {
      // Show typing indicator
      setTyping(true)
      
      // Send message via API
      const result = await sendMessageMutation.mutateAsync({
        userId: MOCK_USER_ID,
        sessionId: currentSession?.id,
        message: content.trim(),
      })
      
      // Update current session with the new messages
      setCurrentSession(result.session)
      
    } catch (error) {
      console.error("Failed to send message:", error)
      setError("Failed to send message. Please try again.")
    } finally {
      setTyping(false)
    }
  }

  // Show loading state while sessions are loading
  if (sessionsLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading chat...</p>
        </div>
      </div>
    )
  }

  const messages = currentSession?.messages || []

  return (
    <div className="flex flex-col h-full">
      {/* Error display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 text-sm">
          {error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || sendMessageMutation.isPending} 
      />
    </div>
  )
}
