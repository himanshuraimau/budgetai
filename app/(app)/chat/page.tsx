import { ChatContainer } from "@/components/chat/chat-container"
import { TopBar } from "@/components/layout/top-bar"

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Chat" />
      <ChatContainer />
    </div>
  )
}
