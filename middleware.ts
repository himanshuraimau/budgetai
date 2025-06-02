import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, just allow all requests to pass through
  // We'll handle authentication in the individual API routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static files and auth
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}