import type { Product, User, ChatMessage } from "@/types"

export const mockProducts: Product[] = [
  {
    id: "prod_1",
    title: 'MacBook Pro 14" M3',
    description:
      "Powerful laptop for professionals with M3 chip and stunning Liquid Retina XDR display. Perfect for development, design, and creative work.",
    price: 1999,
    currency: "USD",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    rating: 4.8,
    reviewCount: 2341,
    seller: {
      id: "seller_apple",
      name: "Apple Store",
      rating: 4.9,
      verified: true,
    },
    category: "Electronics",
    inStock: true,
    specifications: {
      Processor: "Apple M3",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "14-inch Liquid Retina XDR",
      Graphics: "10-core GPU",
      Battery: "Up to 18 hours",
    },
  },
  {
    id: "prod_2",
    title: "iPhone 15 Pro",
    description:
      "The most advanced iPhone with titanium design, Action Button, and powerful A17 Pro chip for incredible performance.",
    price: 999,
    currency: "USD",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    rating: 4.7,
    reviewCount: 1892,
    seller: {
      id: "seller_apple",
      name: "Apple Store",
      rating: 4.9,
      verified: true,
    },
    category: "Electronics",
    inStock: true,
    specifications: {
      Display: "6.1-inch Super Retina XDR",
      Chip: "A17 Pro",
      Camera: "48MP Main, 12MP Ultra Wide",
      Storage: "128GB",
      Material: "Titanium",
      "Water Resistance": "IP68",
    },
  },
  {
    id: "prod_3",
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.",
    price: 399,
    currency: "USD",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.6,
    reviewCount: 3421,
    seller: {
      id: "seller_sony",
      name: "Sony Official Store",
      rating: 4.8,
      verified: true,
    },
    category: "Audio",
    inStock: true,
    specifications: {
      "Noise Canceling": "Industry-leading",
      "Battery Life": "30 hours",
      "Quick Charge": "3 min for 3 hours",
      "Driver Unit": "30mm",
      "Frequency Response": "4Hz-40kHz",
      Weight: "250g",
    },
  },
  {
    id: "prod_4",
    title: "Dell XPS 13 Plus",
    description:
      "Ultra-thin laptop with 13th Gen Intel processors, stunning InfinityEdge display, and premium build quality.",
    price: 1299,
    currency: "USD",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.5,
    reviewCount: 987,
    seller: {
      id: "seller_dell",
      name: "Dell Technologies",
      rating: 4.7,
      verified: true,
    },
    category: "Electronics",
    inStock: true,
    specifications: {
      Processor: "13th Gen Intel Core i7",
      RAM: "16GB LPDDR5",
      Storage: "512GB SSD",
      Display: "13.4-inch FHD+",
      Graphics: "Intel Iris Xe",
      Weight: "2.73 lbs",
    },
  },
  {
    id: "prod_5",
    title: "Apple Watch Series 9",
    description: "The most advanced Apple Watch with S9 chip, Double Tap gesture, and comprehensive health tracking.",
    price: 399,
    currency: "USD",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.8,
    reviewCount: 2156,
    seller: {
      id: "seller_apple",
      name: "Apple Store",
      rating: 4.9,
      verified: true,
    },
    category: "Wearables",
    inStock: true,
    specifications: {
      Chip: "S9 SiP",
      Display: "45mm Retina LTPO OLED",
      "Battery Life": "Up to 18 hours",
      "Water Resistance": "50 meters",
      Connectivity: "GPS + Cellular",
      "Health Features": "ECG, Blood Oxygen, Sleep Tracking",
    },
  },
  {
    id: "prod_6",
    title: "Samsung Galaxy S24 Ultra",
    description:
      "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity and creativity.",
    price: 1199,
    currency: "USD",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.6,
    reviewCount: 1543,
    seller: {
      id: "seller_samsung",
      name: "Samsung Electronics",
      rating: 4.6,
      verified: true,
    },
    category: "Electronics",
    inStock: true,
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 3",
      RAM: "12GB",
      Storage: "256GB",
      Camera: "200MP Main + 50MP Periscope",
      "S Pen": "Included",
    },
  },
]

export const mockUser: User = {
  id: "user_1",
  email: "john@example.com",
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  createdAt: new Date(),
  preferences: {
    theme: "light",
    currency: "USD",
    notifications: true,
  },
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    type: "ai",
    contentType: "text",
    content:
      "Hi! I'm your AI shopping assistant. I can help you find the perfect products, compare prices, and make personalized recommendations. What are you looking for today?",
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: "msg_2",
    type: "user",
    contentType: "text",
    content: "I need a new laptop for programming",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "msg_3",
    type: "ai",
    contentType: "product",
    content:
      "Great! I found some excellent laptops for programming. Here are my top recommendations based on performance, build quality, and developer reviews:",
    timestamp: new Date(Date.now() - 240000),
    products: [
      {
        product: mockProducts[0],
        reason: "Perfect for development with M3 chip, 16GB RAM, and excellent battery life",
      },
      {
        product: mockProducts[3],
        reason: "Great Windows alternative with 13th Gen Intel and premium build quality",
      },
    ],
  },
]

// AI Response Generator
export const getAIResponse = async (userMessage: string): Promise<ChatMessage> => {
  const message = userMessage.toLowerCase()

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const response: ChatMessage = {
    id: `msg_${Date.now()}`,
    type: "ai",
    contentType: "text",
    content: "",
    timestamp: new Date(),
  }

  // Programming/Development related
  if (
    message.includes("programming") ||
    message.includes("coding") ||
    message.includes("development") ||
    message.includes("developer")
  ) {
    response.contentType = "product"
    response.content = "Here are some excellent options for programming and development work:"
    response.products = [
      {
        product: mockProducts[0], // MacBook Pro
        reason: "Excellent for development with M3 chip and long battery life",
      },
      {
        product: mockProducts[3], // Dell XPS
        reason: "Great Windows laptop with powerful specs for coding",
      },
    ]
  }
  // Phone/Mobile related
  else if (message.includes("phone") || message.includes("mobile") || message.includes("smartphone")) {
    response.contentType = "product"
    response.content = "I found some great smartphones for you:"
    response.products = [
      {
        product: mockProducts[1], // iPhone 15 Pro
        reason: "Latest iPhone with advanced camera and performance",
      },
      {
        product: mockProducts[5], // Samsung Galaxy S24
        reason: "Powerful Android phone with S Pen and AI features",
      },
    ]
  }
  // Audio/Headphones related
  else if (
    message.includes("headphones") ||
    message.includes("audio") ||
    message.includes("music") ||
    message.includes("sound")
  ) {
    response.contentType = "product"
    response.content = "Here are some top-rated headphones:"
    response.products = [
      {
        product: mockProducts[2], // Sony WH-1000XM5
        reason: "Industry-leading noise cancellation and 30-hour battery",
      },
    ]
  }
  // Watch/Wearable related
  else if (
    message.includes("watch") ||
    message.includes("fitness") ||
    message.includes("health") ||
    message.includes("wearable")
  ) {
    response.contentType = "product"
    response.content = "Check out these smart watches:"
    response.products = [
      {
        product: mockProducts[4], // Apple Watch
        reason: "Most advanced health tracking and seamless iPhone integration",
      },
    ]
  }
  // Budget related
  else if (
    message.includes("budget") ||
    message.includes("cheap") ||
    message.includes("affordable") ||
    message.includes("under")
  ) {
    response.content =
      "I understand you're looking for budget-friendly options. What's your price range? I can find great products that offer excellent value for money."
  }
  // Comparison related
  else if (message.includes("compare") || message.includes("vs") || message.includes("difference")) {
    response.content =
      "I'd be happy to help you compare products! Which specific items would you like me to compare? I can break down the differences in features, performance, and value."
  }
  // General greeting or unclear
  else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    response.content =
      "Hello! I'm here to help you find the perfect products. What are you shopping for today? I can help with electronics, accessories, or any other items you need."
  }
  // Default response
  else {
    const responses = [
      "I'd be happy to help you find what you're looking for! Could you tell me more about what you need?",
      "That's interesting! What specific features or requirements do you have in mind?",
      "Let me help you with that. What's your budget range and any specific preferences?",
      "I can definitely assist with that! Are you looking for any particular brand or features?",
      "Great question! To give you the best recommendations, could you share more details about your needs?",
    ]
    response.content = responses[Math.floor(Math.random() * responses.length)]
  }

  return response
}

// Enhanced mock orders with more data
export const mockOrders = [
  {
    id: "ORD-001",
    product: 'MacBook Pro 14" M3',
    price: 1999,
    status: "delivered" as const,
    date: "2024-01-15",
    image: "/placeholder.svg?height=60&width=60",
    trackingNumber: "1Z999AA1234567890",
    estimatedDelivery: "Delivered",
    quantity: 1,
  },
  {
    id: "ORD-002",
    product: "iPhone 15 Pro",
    price: 999,
    status: "shipped" as const,
    date: "2024-01-20",
    image: "/placeholder.svg?height=60&width=60",
    trackingNumber: "1Z999AA1234567891",
    estimatedDelivery: "Jan 25, 2024",
    quantity: 1,
  },
  {
    id: "ORD-003",
    product: "Sony WH-1000XM5 Headphones",
    price: 399,
    status: "processing" as const,
    date: "2024-01-22",
    image: "/placeholder.svg?height=60&width=60",
    trackingNumber: null,
    estimatedDelivery: "Jan 28, 2024",
    quantity: 1,
  },
  {
    id: "ORD-004",
    product: "Apple Watch Series 9",
    price: 399,
    status: "confirmed" as const,
    date: "2024-01-23",
    image: "/placeholder.svg?height=60&width=60",
    trackingNumber: null,
    estimatedDelivery: "Jan 30, 2024",
    quantity: 1,
  },
]

// Trending products data
export const trendingProducts = [
  { name: "MacBook Pro M3", price: "$1,999", trend: "+15%", category: "Laptops" },
  { name: "Sony WH-1000XM5", price: "$399", trend: "+8%", category: "Audio" },
  { name: "iPhone 15 Pro", price: "$999", trend: "+12%", category: "Phones" },
  { name: "Apple Watch Series 9", price: "$399", trend: "+6%", category: "Wearables" },
  { name: "Dell XPS 13 Plus", price: "$1,299", trend: "+10%", category: "Laptops" },
]
