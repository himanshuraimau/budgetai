import OpenAI from "openai"
import type { ChatMessage } from "@/types/chat"
import type { Product, ProductCard } from "@/types/product"
import { mockProducts } from "./mock-data"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIResponse {
  content: string
  products?: ProductCard[]
  contentType: "text" | "product" | "order" | "payment"
}

// Function to find relevant products based on query
function findRelevantProducts(query: string, maxResults: number = 3): ProductCard[] {
  const lowerQuery = query.toLowerCase()
  const searchTerms = lowerQuery.split(" ").filter(term => term.length > 2)
  
  const scoredProducts = mockProducts.map(product => {
    let score = 0
    const productText = `${product.title} ${product.description} ${product.category}`.toLowerCase()
    
    // Score based on exact matches and partial matches
    searchTerms.forEach(term => {
      if (productText.includes(term)) {
        score += 1
      }
      // Bonus for title matches
      if (product.title.toLowerCase().includes(term)) {
        score += 2
      }
      // Bonus for category matches
      if (product.category.toLowerCase().includes(term)) {
        score += 1.5
      }
    })
    
    return { product, score }
  })
  
  // Filter products with score > 0 and sort by score
  const relevantProducts = scoredProducts
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
  
  return relevantProducts.map(({ product, score }) => ({
    product,
    reason: generateRecommendationReason(product, query, score)
  }))
}

function generateRecommendationReason(product: Product, query: string, score: number): string {
  const reasons = [
    `Matches your search for "${query}"`,
    `Highly rated (${product.rating}/5) with ${product.reviewCount} reviews`,
    `Popular choice in ${product.category}`,
    `Great value at $${product.price}`,
    `Top seller from ${product.seller.name}`,
  ]
  
  // Select reason based on product characteristics
  if (product.rating >= 4.5) {
    return reasons[1]
  } else if (score > 3) {
    return reasons[0]
  } else if (product.price < 500) {
    return reasons[3]
  } else {
    return reasons[2]
  }
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  try {
    // Check if user is asking about products
    const productKeywords = [
      "laptop", "phone", "headphones", "watch", "macbook", "iphone", 
      "samsung", "sony", "dell", "apple", "buy", "purchase", "recommend",
      "best", "cheap", "expensive", "review", "specs", "specifications"
    ]
    
    const isProductQuery = productKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    )
    
    // Build conversation context for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a helpful shopping assistant AI. You help users find products, answer questions about specifications, compare products, and provide shopping advice. 
        
        When users ask about products, be specific and helpful. If you recommend products, explain why they match the user's needs.
        
        Keep responses conversational and friendly. If a user asks about specific products or categories, you can mention that you'll show them relevant products.
        
        Current product categories available: Electronics, Audio, Wearables
        
        Be concise but informative in your responses.`
      }
    ]
    
    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10)
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      })
    })
    
    // Add current user message
    messages.push({
      role: "user",
      content: userMessage
    })
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    })
    
    const aiContent = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
    
    // If it's a product query, find relevant products
    let products: ProductCard[] = []
    let contentType: "text" | "product" = "text"
    
    if (isProductQuery) {
      products = findRelevantProducts(userMessage)
      if (products.length > 0) {
        contentType = "product"
      }
    }
    
    return {
      content: aiContent,
      products: products.length > 0 ? products : undefined,
      contentType
    }
    
  } catch (error) {
    console.error("Error generating AI response:", error)
    
    // Fallback response
    return {
      content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
      contentType: "text"
    }
  }
}

// Function to generate a chat session ID
export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Function to generate a message ID
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
