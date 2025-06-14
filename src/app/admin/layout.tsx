import { AuthenticatedPaymanChatbot } from "@/components/ui/authenticated-payman-chatbot"
import { AdminHeader } from "@/components/layout/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">
        {children}
      </main>
      <AuthenticatedPaymanChatbot />
    </div>
  )
}
