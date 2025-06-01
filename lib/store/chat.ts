import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { ChatMessage, ChatSession } from "@/types/chat"

interface ChatState {
  // Current active session
  currentSession: ChatSession | null
  
  // All user sessions
  sessions: ChatSession[]
  
  // UI state
  isLoading: boolean
  isTyping: boolean
  error: string | null
  
  // Actions
  setCurrentSession: (session: ChatSession | null) => void
  setSessions: (sessions: ChatSession[]) => void
  addMessage: (message: ChatMessage) => void
  updateLastMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  setTyping: (typing: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Session management
  createNewSession: (userId: string) => ChatSession
  deleteSession: (sessionId: string) => void
  clearSessions: () => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentSession: null,
        sessions: [],
        isLoading: false,
        isTyping: false,
        error: null,
        
        // Actions
        setCurrentSession: (session) => {
          set({ currentSession: session }, false, "setCurrentSession")
        },
        
        setSessions: (sessions) => {
          set({ sessions }, false, "setSessions")
        },
        
        addMessage: (message) => {
          const { currentSession } = get()
          if (currentSession) {
            const updatedSession = {
              ...currentSession,
              messages: [...currentSession.messages, message],
              updatedAt: new Date(),
            }
            
            set(
              (state) => ({
                currentSession: updatedSession,
                sessions: state.sessions.map((session) =>
                  session.id === updatedSession.id ? updatedSession : session
                ),
              }),
              false,
              "addMessage"
            )
          }
        },
        
        updateLastMessage: (message) => {
          const { currentSession } = get()
          if (currentSession && currentSession.messages.length > 0) {
            const updatedMessages = [...currentSession.messages]
            updatedMessages[updatedMessages.length - 1] = message
            
            const updatedSession = {
              ...currentSession,
              messages: updatedMessages,
              updatedAt: new Date(),
            }
            
            set(
              (state) => ({
                currentSession: updatedSession,
                sessions: state.sessions.map((session) =>
                  session.id === updatedSession.id ? updatedSession : session
                ),
              }),
              false,
              "updateLastMessage"
            )
          }
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading }, false, "setLoading")
        },
        
        setTyping: (typing) => {
          set({ isTyping: typing }, false, "setTyping")
        },
        
        setError: (error) => {
          set({ error }, false, "setError")
        },
        
        clearError: () => {
          set({ error: null }, false, "clearError")
        },
        
        createNewSession: (userId) => {
          const newSession: ChatSession = {
            id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          
          set(
            (state) => ({
              currentSession: newSession,
              sessions: [newSession, ...state.sessions],
            }),
            false,
            "createNewSession"
          )
          
          return newSession
        },
        
        deleteSession: (sessionId) => {
          set(
            (state) => {
              const updatedSessions = state.sessions.filter((s) => s.id !== sessionId)
              const currentSession = state.currentSession?.id === sessionId 
                ? (updatedSessions.length > 0 ? updatedSessions[0] : null)
                : state.currentSession
              
              return {
                sessions: updatedSessions,
                currentSession,
              }
            },
            false,
            "deleteSession"
          )
        },
        
        clearSessions: () => {
          set(
            {
              sessions: [],
              currentSession: null,
            },
            false,
            "clearSessions"
          )
        },
      }),
      {
        name: "chat-store",
        // Only persist sessions and currentSession, not UI state
        partialize: (state) => ({
          sessions: state.sessions,
          currentSession: state.currentSession,
        }),
        version: 1,
      }
    ),
    {
      name: "chat-store",
    }
  )
)
