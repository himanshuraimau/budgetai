import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith('/login') || 
            req.nextUrl.pathname.startsWith('/signup') ||
            req.nextUrl.pathname === '/') {
          return true
        }
        
        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Protect these routes
    '/chat/:path*',
    '/settings/:path*',
    '/orders/:path*',
    '/search/:path*',
    // Allow these auth routes
    '/login',
    '/signup',
    '/',
  ]
}
