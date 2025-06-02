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
import { Copy, Check } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const { data: session } = useSession()
  const { company, user } = useCompany()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={sessionUser?.name || "User"} />
            <AvatarFallback>{sessionUser?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{sessionUser?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{sessionUser?.email}</p>
            {company && (
              <p className="text-xs leading-none text-muted-foreground">{company.name}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {user?.role === 'admin' && company?.joinCode && (
          <>
            <div className="px-2 py-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Company Code:</span>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {company.joinCode}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyJoinCode}
                    className="h-6 w-6 p-0"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
