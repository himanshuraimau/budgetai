import { NextRequest, NextResponse } from "next/server"
import { ChatSessionModel } from "@/lib/models/Chat"
import dbConnect from "@/lib/dbConnect"
import { generateAIResponse, generateChatId, generateMessageId } from "@/lib/ai-service"
import type { ChatMessage } from "@/types/chat"

// Force dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log("GET /api/chat called")
  try {
    await dbConnect()
    console.log("Database connected successfully")
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const sessionId = searchParams.get("sessionId")
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }
    
    if (sessionId) {
      // Get specific chat session
      const session = await ChatSessionModel.findOne({ id: sessionId, userId })
      if (!session) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
      }
      return NextResponse.json(session)
    } else {
      // Get all chat sessions for user
      const sessions = await ChatSessionModel.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(50)
      return NextResponse.json(sessions || [])
    }
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("POST /api/chat called")
  try {
    await dbConnect()
    console.log("Database connected for POST")
    
    const body = await request.json()
    console.log("Request body:", body)
    const { userId, sessionId, message } = body
    
    if (!userId || !message) {
      return NextResponse.json({ error: "User ID and message are required" }, { status: 400 })
    }
    
    // Create user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: "user",
      contentType: "text",
      content: message,
      timestamp: new Date(),
    }
    
    let session
    if (sessionId) {
      // Add to existing session
      session = await ChatSessionModel.findOne({ id: sessionId, userId })
      if (!session) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
      }
    } else {
      // Create new session
      session = new ChatSessionModel({
        id: generateChatId(),
        userId,
        messages: [],
      })
    }
    
    // Add user message to session
    session.messages.push(userMessage)
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, session.messages)
    
    // Create AI message
    const aiMessage: ChatMessage = {
      id: generateMessageId(),
      type: "ai",
      contentType: aiResponse.contentType,
      content: aiResponse.content,
      timestamp: new Date(),
      products: aiResponse.products,
    }
    
    // Add AI message to session
    session.messages.push(aiMessage)
    
    // Save session
    await session.save()
    
    return NextResponse.json({
      session: session,
      userMessage,
      aiMessage,
    })
  } catch (error) {
    console.error("Error creating chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const userId = searchParams.get("userId")
    
    if (!sessionId || !userId) {
      return NextResponse.json({ error: "Session ID and User ID are required" }, { status: 400 })
    }
    
    const result = await ChatSessionModel.deleteOne({ id: sessionId, userId })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Chat session deleted successfully" })
  } catch (error) {
    console.error("Error deleting chat session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
