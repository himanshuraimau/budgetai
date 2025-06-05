import type { Metadata } from 'next'
import { AuthProvider } from '../components/auth-provider'
import { QueryProvider } from '../components/query-provider'
import { Toaster } from '../components/ui/toaster'
import { AuthenticatedPaymanChatbot } from '../components/ui/authenticated-payman-chatbot'
import './globals.css'

export const metadata: Metadata = {
  title: 'BudgetAI',
  description: 'AI-powered budget management platform',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
            <AuthenticatedPaymanChatbot />
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
