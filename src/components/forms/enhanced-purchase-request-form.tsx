"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEmployeeAPI } from "@/hooks/use-employee-api"
import { useSession } from "next-auth/react"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Brain, 
  Zap, 
  DollarSign, 
  Clock,
  TrendingUp,
  Shield
} from "lucide-react"

const requestSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, "Amount must be a positive number"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  justification: z.string().optional(),
  vendor: z.string().optional(),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
})

type RequestFormValues = z.infer<typeof requestSchema>

interface AIProcessingState {
  isProcessing: boolean
  currentAgent: string
  progress: number
  agentResponses: Array<{
    agentId: string
    agentName: string
    decision: 'approve' | 'deny' | 'escalate'
    confidence: number
    reasoning: string
    riskLevel: 'low' | 'medium' | 'high'
    executionTime: number
  }>
  finalDecision?: 'approve' | 'deny' | 'escalate'
  paymentExecuted?: boolean
  fraudRisk?: {
    riskScore: number
    riskFactors: string[]
  }
  insights?: any
  error?: string
}

export function EnhancedPurchaseRequestForm() {
  const { data: session } = useSession()
  const { submitRequest, isSubmittingRequest } = useEmployeeAPI()
  
  const [aiState, setAIState] = useState<AIProcessingState>({
    isProcessing: false,
    currentAgent: '',
    progress: 0,
    agentResponses: []
  })
  
  const [showPreview, setShowPreview] = useState(false)
  const [estimatedProcessingTime, setEstimatedProcessingTime] = useState(0)

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema) as any,
    defaultValues: {
      amount: "",
      description: "",
      category: "",
      justification: "",
      vendor: "",
      urgency: "medium",
    },
  })

  // Watch form values for real-time insights
  const watchedValues = form.watch()
  
  useEffect(() => {
    if (watchedValues.amount && watchedValues.category) {
      // Get real-time risk assessment and insights
      getRealTimeInsights()
    }
  }, [watchedValues.amount, watchedValues.category])

  const getRealTimeInsights = async () => {
    // This would call a lightweight API to get instant insights
    // For now, simulate the response
    const amount = Number.parseFloat(watchedValues.amount || "0")
    
    if (amount > 0) {
      setEstimatedProcessingTime(amount > 1000 ? 5 : 2)
      setShowPreview(true)
    }
  }

  const processWithAI = async (values: RequestFormValues) => {
    setAIState(prev => ({
      ...prev,
      isProcessing: true,
      currentAgent: 'Budget Guardian',
      progress: 0,
      agentResponses: []
    }))

    try {
      // Step 1: Process through AI Agents
      const response = await fetch('/api/agents/process-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestData: {
            amount: Number.parseFloat(values.amount),
            description: values.description,
            category: values.category,
            justification: values.justification,
            vendor: values.vendor,
            urgency: values.urgency
          },
          requestType: 'approval',
          priority: values.urgency
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process request')
      }

      const result = await response.json()
      
      // Simulate real-time updates for better UX
      await simulateAIProcessing(result)
      
      return result

    } catch (error) {
      console.error('AI processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setAIState(prev => ({
        ...prev,
        isProcessing: false,
        currentAgent: '',
        progress: 0,
        error: errorMessage
      }))
      throw error
    }
  }

  const simulateAIProcessing = async (result: any) => {
    const agents = [
      { name: 'Budget Guardian', duration: 1000 },
      { name: 'Universal Approval', duration: 1500 },
      { name: 'Payment Execution', duration: 1000 }
    ]

    for (let i = 0; i < agents.length; i++) {
      setAIState(prev => ({
        ...prev,
        currentAgent: agents[i].name,
        progress: ((i + 1) / agents.length) * 100
      }))
      
      await new Promise(resolve => setTimeout(resolve, agents[i].duration))
      
      // Add agent response when available
      if (result.result.agentResponses[i]) {
        setAIState(prev => ({
          ...prev,
          agentResponses: [...prev.agentResponses, {
            ...result.result.agentResponses[i],
            agentName: getAgentDisplayName(result.result.agentResponses[i].agentId)
          }]
        }))
      }
    }

    // Final state
    setAIState(prev => ({
      ...prev,
      isProcessing: false,
      currentAgent: '',
      finalDecision: result.result.finalDecision,
      paymentExecuted: result.result.paymentExecuted,
      fraudRisk: result.fraudRisk,
      insights: result.insights
    }))
  }

  const getAgentDisplayName = (agentId: string): string => {
    const names = {
      'budget-guardian': 'Budget Guardian',
      'universal-approval': 'Universal Approval',
      'payment-execution': 'Payment Execution',
      'smart-reimbursement': 'Smart Reimbursement'
    }
    return names[agentId as keyof typeof names] || agentId
  }

  const onSubmit = async (values: RequestFormValues) => {
    if (!session?.user) return

    try {
      // Process through AI agents first
      const aiResult = await processWithAI(values)
      
      // Show success message for approved requests
      if (aiResult.result.finalDecision === 'approve') {
        // Reset form and show success
        form.reset()
        
        // Refresh the requests data in the background (if using useEmployeeAPI)
        if (typeof window !== 'undefined') {
          // Trigger a page refresh or data refetch after a short delay
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        }
        
        setTimeout(() => {
          setAIState({
            isProcessing: false,
            currentAgent: '',
            progress: 0,
            agentResponses: []
          })
          setShowPreview(false)
        }, 3000) // Keep success state visible for 3 seconds before refreshing
      }
      
      // Handle denied requests
      else if (aiResult.result.finalDecision === 'deny') {
        // Keep form data so user can modify and resubmit
        setTimeout(() => {
          setAIState(prev => ({
            ...prev,
            isProcessing: false,
            currentAgent: ''
          }))
        }, 3000) // Keep denial reason visible for 3 seconds
      }
      
      // Handle escalated requests (save to traditional system)
      else if (aiResult.result.finalDecision === 'escalate') {
        // Request is already saved to database by the AI processing endpoint
        // Just show that it's been escalated for manual review
        setTimeout(() => {
          form.reset()
          setAIState({
            isProcessing: false,
            currentAgent: '',
            progress: 0,
            agentResponses: []
          })
          setShowPreview(false)
          
          // Refresh to show the escalated request in the list
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }, 3000)
      }

    } catch (error) {
      console.error('Submission error:', error)
      
      // Show error state and reset processing
      setAIState(prev => ({
        ...prev,
        isProcessing: false,
        currentAgent: '',
        progress: 0
      }))
      
      // You could add error handling UI here
      alert('Error processing request. Please try again.')
    }
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve': return 'text-green-600'
      case 'deny': return 'text-red-600'
      case 'escalate': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approve': return <CheckCircle className="h-4 w-4" />
      case 'deny': return <XCircle className="h-4 w-4" />
      case 'escalate': return <AlertTriangle className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[riskLevel as keyof typeof colors] || colors.medium
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Purchase Request
          </CardTitle>
          <CardDescription>
            Submit your request for instant AI analysis and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...form.register("amount")} 
                />
                {form.formState.errors.amount && (
                  <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => form.setValue("category", value)}
                  defaultValue={form.getValues("category")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Advertising">Advertising</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor (Optional)</Label>
                <Input 
                  id="vendor" 
                  placeholder="Company name" 
                  {...form.register("vendor")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select
                  onValueChange={(value) => form.setValue("urgency", value as "low" | "medium" | "high")}
                  defaultValue={form.getValues("urgency")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                placeholder="Brief description of the purchase" 
                {...form.register("description")} 
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">
                Justification <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="justification"
                placeholder="Why is this purchase necessary?"
                rows={3}
                {...form.register("justification")}
              />
            </div>

            {/* Real-time Preview */}
            {showPreview && watchedValues.amount && (
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>Estimated processing time: {estimatedProcessingTime} seconds</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      AI Ready
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={aiState.isProcessing || isSubmittingRequest}
            >
              {aiState.isProcessing ? (
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-pulse" />
                  Processing with AI...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Submit for AI Analysis
                </div>
              )}
            </Button>

            {/* Error State */}
            {aiState.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Error:</strong> {aiState.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Connection Error State */}
            {aiState.currentAgent === '' && !aiState.isProcessing && form.formState.isSubmitted && !aiState.finalDecision && !aiState.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Unable to process request through AI agents. Please check your connection and try again.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      {aiState.isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 animate-pulse" />
              AI Analysis in Progress
            </CardTitle>
            <CardDescription>
              Current Agent: {aiState.currentAgent}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={aiState.progress} className="w-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Processing...</span>
                <span>{Math.round(aiState.progress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Responses */}
      {aiState.agentResponses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              AI Agent Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiState.agentResponses.map((response, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{response.agentName}</span>
                      <Badge variant={response.decision === 'approve' ? 'default' : 'secondary'}>
                        {response.decision}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getRiskBadge(response.riskLevel)}
                      >
                        {response.riskLevel} risk
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {response.confidence}% confident
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{response.reasoning}</p>
                  <div className="text-xs text-muted-foreground">
                    Processed in {response.executionTime}ms
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Decision */}
      {aiState.finalDecision && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${getDecisionColor(aiState.finalDecision)}`}>
              {getDecisionIcon(aiState.finalDecision)}
              Final Decision: {aiState.finalDecision.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiState.finalDecision === 'approve' && (
                <div className="space-y-2">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Request Approved!</strong> 
                      {aiState.paymentExecuted && " Payment has been executed automatically."}
                      {!aiState.paymentExecuted && " Payment processing in progress."}
                    </AlertDescription>
                  </Alert>
                  <div className="text-sm text-muted-foreground">
                    Your request has been processed and approved. The page will refresh shortly to show your updated request history.
                  </div>
                </div>
              )}

              {aiState.finalDecision === 'deny' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Request Denied.</strong> Please review the agent feedback above and consider modifying your request.
                  </AlertDescription>
                </Alert>
              )}

              {aiState.finalDecision === 'escalate' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Request Escalated.</strong> Your request requires manual review and has been forwarded to administrators.
                  </AlertDescription>
                </Alert>
              )}

              {/* Fraud Risk Display */}
              {aiState.fraudRisk && (
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Security Analysis</span>
                    <Badge 
                      variant="outline" 
                      className={aiState.fraudRisk.riskScore > 70 ? 'bg-red-100 text-red-800' : 
                                aiState.fraudRisk.riskScore > 40 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}
                    >
                      Risk Score: {aiState.fraudRisk.riskScore}%
                    </Badge>
                  </div>
                  {aiState.fraudRisk.riskFactors?.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Risk Factors:</strong>
                      <ul className="list-inside list-disc mt-1">
                        {aiState.fraudRisk.riskFactors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Insights */}
              {aiState.insights && (
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">AI Insights</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {JSON.stringify(aiState.insights, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 