export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    // Protect all routes except auth pages and public assets
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}