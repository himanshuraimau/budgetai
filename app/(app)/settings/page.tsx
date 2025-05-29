import { TopBar } from "@/components/layout/top-bar"
import { AppSettings } from "@/components/settings/app-settings"

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Settings" />
      <AppSettings />
    </div>
  )
}
