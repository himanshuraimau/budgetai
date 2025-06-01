import { Bot, User } from "lucide-react"
import { ProductCard } from "./product-card"
import type { ChatMessage } from "@/types/chat"

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user"

  return (
    <div className={`flex items-start space-x-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md ${isUser ? "order-first" : ""}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser ? "bg-primary text-white" : "bg-surface border border-default text-primary"
          }`}
        >
          {message.content}
        </div>

        {message.products && message.products.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.products.map((productCard, index) => (
              <ProductCard key={index} productCard={productCard} />
            ))}
          </div>
        )}

        <p className="text-xs text-muted mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}
