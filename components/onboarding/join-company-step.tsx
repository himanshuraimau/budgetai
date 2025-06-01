"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useOnboardingStore } from "@/lib/store"
import { useOnboardingAPI } from "@/hooks/use-onboarding-api"
import { toast } from "sonner"

export function JoinCompanyStep() {
  const { setInviteCode } = useOnboardingStore()
  const { completeJoinCompany, isLoading } = useOnboardingAPI()
  const [activeTab, setActiveTab] = useState("invite")
  const [inviteCode, setInviteCodeState] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [message, setMessage] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleInviteCodeChange = (code: string) => {
    setInviteCodeState(code)
    setInviteCode(code)
  }

  const handleJoinWithCode = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code")
      return
    }

    setIsJoining(true)
    try {
      const result = await completeJoinCompany(inviteCode)
      if (result) {
        toast.success("Successfully joined company!")
      }
    } catch (error) {
      console.error('Error joining company:', error)
      toast.error("Failed to join company. Please check your invite code.")
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Join Your Company</h2>
        <p className="text-muted-foreground">Connect with your company to start submitting purchase requests.</p>
      </div>

      <Tabs defaultValue="invite" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invite">Join with Invite Code</TabsTrigger>
          <TabsTrigger value="request">Request Access</TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Company Invite Code</Label>
                  <Input
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => handleInviteCodeChange(e.target.value)}
                    placeholder="Enter your company's invite code"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your company admin can provide you with an invite code.
                  </p>
                </div>
                <Button 
                  onClick={handleJoinWithCode}
                  disabled={!inviteCode.trim() || isJoining || isLoading}
                  className="w-full"
                >
                  {isJoining ? "Joining..." : "Join Company"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message to Admin</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly explain who you are and why you need access"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
