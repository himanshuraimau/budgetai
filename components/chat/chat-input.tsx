"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-default p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "AI is typing..." : "Ask me anything about products..."}
            className="min-h-[44px] max-h-32 resize-none bg-surface border-default"
            rows={1}
            disabled={disabled}
          />
        </div>
        <Button type="button" variant="ghost" size="icon" disabled={disabled}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" disabled={disabled}>
          <Mic className="h-4 w-4" />
        </Button>
        <Button type="submit" disabled={!message.trim() || disabled} className="bg-primary hover:bg-primary/90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
