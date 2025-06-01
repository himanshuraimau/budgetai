import { NextRequest, NextResponse } from "next/server"

// Force dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log("GET /api/chat called")
  try {
    return NextResponse.json({ 
      message: "Chat API GET working",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error in GET /api/chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("POST /api/chat called")
  try {
    const body = await request.json()
    console.log("Request body:", body)
    
    return NextResponse.json({
      message: "Chat API POST working",
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error in POST /api/chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
