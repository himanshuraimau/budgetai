"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboardingStore } from "@/lib/store"
import { useOnboardingAPI } from "@/hooks/use-onboarding-api"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export function CompletionStep() {
  const router = useRouter()
  const { data: session } = useSession()
  const { data } = useOnboardingStore()
  const { completeOnboarding, isLoading } = useOnboardingAPI()
  const [isCompleting, setIsCompleting] = useState(false)
  const isAdmin = data.userRole === "admin"

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      const result = await completeOnboarding()
      
      if (result) {
        // Navigate to the appropriate dashboard based on role
        if (result.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/employee/dashboard")
        }
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-bold">Setup Complete!</h2>
        <p className="text-muted-foreground">You're all set to start using Budget Manager AI.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Role:</dt>
                <dd>{isAdmin ? "Company Admin" : "Employee"}</dd>
              </div>

              {data.companySetup && (
                <>
                  <div className="flex justify-between">
                    <dt className="font-medium">Company:</dt>
                    <dd>{data.companySetup.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Industry:</dt>
                    <dd>{data.companySetup.industry}</dd>
                  </div>
                </>
              )}

              {isAdmin && (
                <div className="flex justify-between">
                  <dt className="font-medium">Departments:</dt>
                  <dd>{data.departments.length}</dd>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="font-medium">Payman:</dt>
                <dd>{data.paymanConnected ? "Connected" : "Not connected"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {isAdmin ? (
                <>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>Invite team members to join</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>Review department budgets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>Set up spending rules</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>Submit your first purchase request</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>View your department's budget</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>Complete your profile settings</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleComplete} 
          size="lg"
          disabled={isCompleting || isLoading}
        >
          {isCompleting ? "Completing..." : "Go to Dashboard"}
        </Button>
      </div>
    </div>
  )
}
