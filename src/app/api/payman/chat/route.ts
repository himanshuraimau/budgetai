import { NextRequest, NextResponse } from "next/server"
import { paymanClient } from "@/lib/payman/client"

export async function POST(request: NextRequest) {
  try {
    const { message, userContext } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      )
    }

    // Send the message directly to Payman using natural language
    const response = await paymanClient.ask(message, {
      metadata: {
        source: "payman-chatbot",
        timestamp: new Date().toISOString(),
        userId: userContext?.id || "anonymous-user",
        userName: userContext?.name || "Unknown User",
        userEmail: userContext?.email || "unknown@example.com"
      }
    })

    // Format the response for the chatbot
    return NextResponse.json({
      response: formatPaymanResponse(response),
      metadata: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Payman chat error:', error)
    
    return NextResponse.json(
      { 
        error: "Failed to process message",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to format Payman responses for better readability
function formatPaymanResponse(response: any): string {
  // If it's a string, return as is
  if (typeof response === 'string') {
    return response
  }

  // If it's an object, try to format it nicely
  if (typeof response === 'object' && response !== null) {
    // NEW: Handle Payman task response structure
    if (response.status && response.artifacts && Array.isArray(response.artifacts)) {
      const artifact = response.artifacts[0]
      if (artifact && artifact.content) {
        // Extract the main content
        let content = artifact.content
        
        // Add status info if not completed successfully
        if (response.status !== 'COMPLETED') {
          content = `⚠️ Status: ${response.status}\n${response.statusMessage || ''}\n\n${content}`
        }
        
        // Add success indicator for completed tasks
        if (response.status === 'COMPLETED') {
          content = `✅ ${content}`
        }
        
        return content
      }
    }

    // Check for common response patterns
    
    // Wallet balance response
    if (response.balance !== undefined) {
      return `💰 Wallet Balance: $${response.balance}\n` +
             `Wallet ID: ${response.walletId || response.id || 'N/A'}\n` +
             `Type: ${response.type || 'N/A'}`
    }

    // Payee list response
    if (Array.isArray(response) && response.length > 0 && response[0].payeeId) {
      const payeeList = response.map((payee: any, index: number) => 
        `${index + 1}. ${payee.name || 'Unnamed'} (${payee.payeeId})\n   Email: ${payee.email || 'N/A'}\n   Type: ${payee.type || 'N/A'}`
      ).join('\n\n')
      
      return `👥 Payees Found (${response.length}):\n\n${payeeList}`
    }

    // Wallet list response
    if (Array.isArray(response) && response.length > 0 && response[0].walletId) {
      const walletList = response.map((wallet: any, index: number) => 
        `${index + 1}. ${wallet.name || 'Unnamed'} ($${wallet.balance || 0})\n   ID: ${wallet.walletId}\n   Type: ${wallet.type || 'N/A'}`
      ).join('\n\n')
      
      return `🏦 Wallets Found (${response.length}):\n\n${walletList}`
    }

    // Payment response
    if (response.paymentId || response.transactionId) {
      return `✅ Payment Successful!\n` +
             `Transaction ID: ${response.paymentId || response.transactionId}\n` +
             `Amount: $${response.amount || 'N/A'}\n` +
             `Status: ${response.status || 'Completed'}`
    }

    // Payee creation response
    if (response.payeeId && response.name) {
      return `✅ Payee Created Successfully!\n` +
             `Name: ${response.name}\n` +
             `Payee ID: ${response.payeeId}\n` +
             `Email: ${response.email || 'N/A'}\n` +
             `Type: ${response.type || 'N/A'}`
    }

    // Generic object response
    try {
      return JSON.stringify(response, null, 2)
    } catch {
      return 'Response received but could not format'
    }
  }

  // Fallback
  return 'Response received from Payman agent'
} 