"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/lib/store"
import { CheckCircle2 } from "lucide-react"

export function PaymanStep() {
  const { data, setPaymanConnected } = useOnboardingStore()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)

    // Simulate connection process
    setTimeout(() => {
      setPaymanConnected(true)
      setIsConnecting(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payman Integration</h2>
        <p className="text-muted-foreground">Connect your Payman account to streamline payments and reimbursements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect Payman</CardTitle>
          <CardDescription>Payman helps you manage payments, reimbursements, and financial reporting.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.paymanConnected ? (
            <div className="flex items-center space-x-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Successfully connected to Payman!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Benefits of connecting:</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Automatic payment processing</li>
                  <li>Employee reimbursement tracking</li>
                  <li>Financial reporting integration</li>
                  <li>Expense categorization</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button onClick={handleConnect} disabled={isConnecting} className="flex-1">
                  {isConnecting ? "Connecting..." : "Connect Payman"}
                </Button>
                <Button variant="outline" onClick={() => setPaymanConnected(false)} className="flex-1">
                  Skip for now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
