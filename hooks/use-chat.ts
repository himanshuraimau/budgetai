import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ChatSession, ChatMessage } from "@/types/chat"

// Types for API requests and responses
interface SendMessageRequest {
  userId: string
  sessionId?: string
  message: string
}

interface SendMessageResponse {
  session: ChatSession
  userMessage: ChatMessage
  aiMessage: ChatMessage
}

interface ChatSessionsResponse {
  sessions: ChatSession[]
}

// API functions
const chatApi = {
  // Get all chat sessions for a user
  getSessions: async (userId: string): Promise<ChatSession[]> => {
    const response = await fetch(`/api/chat?userId=${userId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch chat sessions")
    }
    return response.json()
  },

  // Get a specific chat session
  getSession: async (userId: string, sessionId: string): Promise<ChatSession> => {
    const response = await fetch(`/api/chat?userId=${userId}&sessionId=${sessionId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch chat session")
    }
    return response.json()
  },

  // Send a message and get AI response
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error("Failed to send message")
    }
    
    return response.json()
  },

  // Delete a chat session
  deleteSession: async (userId: string, sessionId: string): Promise<void> => {
    const response = await fetch(`/api/chat?userId=${userId}&sessionId=${sessionId}`, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      throw new Error("Failed to delete chat session")
    }
  },
}

// Query keys
export const chatKeys = {
  all: ["chat"] as const,
  sessions: (userId: string) => [...chatKeys.all, "sessions", userId] as const,
  session: (userId: string, sessionId: string) => [...chatKeys.all, "session", userId, sessionId] as const,
}

// React Query hooks

// Hook to get all chat sessions for a user
export function useChatSessions(userId: string) {
  return useQuery({
    queryKey: chatKeys.sessions(userId),
    queryFn: () => chatApi.getSessions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get a specific chat session
export function useChatSession(userId: string, sessionId: string) {
  return useQuery({
    queryKey: chatKeys.session(userId, sessionId),
    queryFn: () => chatApi.getSession(userId, sessionId),
    enabled: !!userId && !!sessionId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to send a message
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (data, variables) => {
      // Update the sessions cache
      queryClient.setQueryData(
        chatKeys.sessions(variables.userId),
        (oldSessions: ChatSession[] | undefined) => {
          // Ensure oldSessions is an array
          const sessionArray = Array.isArray(oldSessions) ? oldSessions : []
          
          if (!data.session) return sessionArray
          
          const existingIndex = sessionArray.findIndex(s => s.id === data.session.id)
          if (existingIndex >= 0) {
            // Update existing session
            const newSessions = [...sessionArray]
            newSessions[existingIndex] = data.session
            return newSessions
          } else {
            // Add new session at the beginning
            return [data.session, ...sessionArray]
          }
        }
      )

      // Update specific session cache if it exists
      if (variables.sessionId) {
        queryClient.setQueryData(
          chatKeys.session(variables.userId, variables.sessionId),
          data.session
        )
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error)
    },
  })
}

// Hook to delete a chat session
export function useDeleteChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, sessionId }: { userId: string; sessionId: string }) =>
      chatApi.deleteSession(userId, sessionId),
    onSuccess: (_, variables) => {
      // Remove session from sessions cache
      queryClient.setQueryData(
        chatKeys.sessions(variables.userId),
        (oldSessions: ChatSession[] | undefined) => {
          // Ensure oldSessions is an array
          const sessionArray = Array.isArray(oldSessions) ? oldSessions : []
          return sessionArray.filter(s => s.id !== variables.sessionId)
        }
      )

      // Remove specific session cache
      queryClient.removeQueries({
        queryKey: chatKeys.session(variables.userId, variables.sessionId),
      })
    },
    onError: (error) => {
      console.error("Failed to delete chat session:", error)
    },
  })
}

// Hook to invalidate and refetch chat data
export function useRefreshChatData() {
  const queryClient = useQueryClient()

  return {
    refreshSessions: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions(userId) })
    },
    refreshSession: (userId: string, sessionId: string) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.session(userId, sessionId) })
    },
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
    },
  }
}
