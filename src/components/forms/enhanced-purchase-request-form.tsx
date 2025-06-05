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
import { useEmployeeAPI } from "@/src/hooks/use-employee-api"
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
    resolver: zodResolver(requestSchema),
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
        throw new Error('Failed to process request')
      }

      const result = await response.json()
      
      // Simulate real-time updates for better UX
      await simulateAIProcessing(result)
      
      return result

    } catch (error) {
      console.error('AI processing error:', error)
      setAIState(prev => ({
        ...prev,
        isProcessing: false,
        currentAgent: '',
        progress: 0
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
      
      // Then submit to traditional system if needed
      if (aiResult.result.finalDecision === 'escalate') {
        await submitRequest({
          amount: Number.parseFloat(values.amount),
          description: values.description,
          category: values.category,
          justification: values.justification || undefined,
        })
      }

      // Reset form if successful
      if (aiResult.result.finalDecision === 'approve') {
        form.reset()
        setTimeout(() => {
          setAIState({
            isProcessing: false,
            currentAgent: '',
            progress: 0,
            agentResponses: []
          })
          setShowPreview(false)
        }, 5000) // Keep success state visible for 5 seconds
      }

    } catch (error) {
      console.error('Submission error:', error)
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
          </form>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      {aiState.isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 animate-pulse" />
              AI Agents Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current: {aiState.currentAgent}
                </span>
                <span className="text-sm font-medium">{Math.round(aiState.progress)}%</span>
              </div>
              <Progress value={aiState.progress} className="w-full" />
              
              {aiState.agentResponses.map((response, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    {getDecisionIcon(response.decision)}
                    <span className="font-medium">{response.agentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskBadge(response.riskLevel)}>
                      {response.riskLevel} risk
                    </Badge>
                    <span className={`text-sm font-medium ${getDecisionColor(response.decision)}`}>
                      {response.decision}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Decision Results */}
      {aiState.finalDecision && !aiState.isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getDecisionIcon(aiState.finalDecision)}
              AI Decision: {aiState.finalDecision.charAt(0).toUpperCase() + aiState.finalDecision.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Payment Status */}
              {aiState.paymentExecuted && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Payment executed successfully! Funds transferred via Payman.
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Fraud Risk Assessment */}
              {aiState.fraudRisk && aiState.fraudRisk.riskScore > 0 && (
                <Alert variant={aiState.fraudRisk.riskScore > 50 ? "destructive" : "default"}>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Fraud Risk Score</span>
                        <Badge variant={aiState.fraudRisk.riskScore > 50 ? "destructive" : "secondary"}>
                          {aiState.fraudRisk.riskScore}%
                        </Badge>
                      </div>
                      {aiState.fraudRisk.riskFactors.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Risk Factors:</span>
                          <ul className="list-disc list-inside mt-1">
                            {aiState.fraudRisk.riskFactors.map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Agent Responses Summary */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Agent Analysis:</h4>
                {aiState.agentResponses.map((response, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{response.agentName}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskBadge(response.riskLevel)}>
                          {response.riskLevel}
                        </Badge>
                        <span className={`text-sm ${getDecisionColor(response.decision)}`}>
                          {response.confidence}% confident
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{response.reasoning}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        {response.executionTime}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 