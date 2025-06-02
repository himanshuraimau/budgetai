"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { signOut, useSession } from "next-auth/react"
import { useCompany } from "@/hooks/use-company"
import { useToast } from "@/hooks/use-toast"
import { ProfileModal } from "@/components/modals/profile-modal"
import { SettingsModal } from "@/components/modals/settings-modal"
import { 
  Copy, 
  Check, 
  User, 
  Settings, 
  LogOut, 
  Shield,
  Building,
  Code
} from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const { data: session } = useSession()
  const { company, user } = useCompany()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const sessionUser = session?.user

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const copyJoinCode = async () => {
    if (company?.joinCode) {
      await navigator.clipboard.writeText(company.joinCode)
      setCopied(true)
      toast({
        title: "Join code copied!",
        description: "Share this code with employees to join your company.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt={sessionUser?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                {sessionUser?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={sessionUser?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-lg">
                    {sessionUser?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{sessionUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">{sessionUser?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={sessionUser?.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {sessionUser?.role}
                    </Badge>
                    {company && (
                      <Badge variant="outline" className="text-xs">
                        <Building className="h-3 w-3 mr-1" />
                        {company.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {user?.role === 'admin' && company?.joinCode && (
            <>
              <div className="px-4 py-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Company Join Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm px-2 py-1">
                      {company.joinCode}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyJoinCode}
                      className="h-8 w-8 p-0 hover:bg-background"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Share with employees to join your company
                </p>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => setProfileModalOpen(true)}
              className="cursor-pointer py-3"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSettingsModalOpen(true)}
              className="cursor-pointer py-3"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer py-3 text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal 
        open={profileModalOpen} 
        onOpenChange={setProfileModalOpen} 
      />
      <SettingsModal 
        open={settingsModalOpen} 
        onOpenChange={setSettingsModalOpen} 
      />
    </>
  )
}
