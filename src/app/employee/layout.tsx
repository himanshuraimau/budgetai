import { AuthenticatedPaymanChatbot } from "@/components/ui/authenticated-payman-chatbot"
import { EmployeeHeader } from "@/components/layout/employee-header"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <EmployeeHeader />
      <main className="flex-1">
        {children}
      </main>
      <AuthenticatedPaymanChatbot />
    </div>
  )
}
