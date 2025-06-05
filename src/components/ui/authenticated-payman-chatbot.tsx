"use client"

import { useSession } from "next-auth/react"
import { PaymanChatbot } from "./payman-chatbot"

export function AuthenticatedPaymanChatbot() {
  const { data: session, status } = useSession()

  // Don't show chatbot during loading or if not authenticated
  if (status === "loading" || !session?.user) {
    return null
  }

  // Pass user context to chatbot for personalized experience
  return <PaymanChatbot userContext={session.user} />
} 