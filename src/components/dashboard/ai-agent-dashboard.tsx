"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Alert, AlertDescription } from "../ui/alert"
import { 
  Brain, 
  Zap, 
  TrendingUp,
  Shield, 
  Clock, 
  DollarSign,
  BarChart3,
  Activity,
  CheckCircle,
  Lightbulb,
  Target,
  RefreshCw
} from "lucide-react"

interface AgentMetrics {
  agentId: string
  successRate: number
  averageConfidence: number
  averageExecutionTime: number
  totalDecisions: number
  lastUpdated: string
}

interface AnalyticsData {
  totalRequests: number
  averageExecutionTime: number
  successRate: number
  agentPerformance: AgentMetrics[]
}

export function AIAgentDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/agents/process-request')
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.analytics)
      }
      
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
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

  const getAgentIcon = (agentId: string) => {
    const icons = {
      'budget-guardian': <Shield className="h-4 w-4" />,
      'universal-approval': <CheckCircle className="h-4 w-4" />,
      'payment-execution': <DollarSign className="h-4 w-4" />,
      'smart-reimbursement': <Zap className="h-4 w-4" />
    }
    return icons[agentId as keyof typeof icons] || <Brain className="h-4 w-4" />
  }

  const getPerformanceColor = (value: number, metric: string) => {
    switch (metric) {
      case 'successRate':
        return value >= 90 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600'
      case 'executionTime':
        return value <= 2000 ? 'text-green-600' : value <= 5000 ? 'text-yellow-600' : 'text-red-600'
      case 'confidence':
        return value >= 85 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 animate-pulse" />
          <span>Loading AI Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Agent Dashboard
          </h2>
          <p className="text-muted-foreground">
            Real-time performance and insights from your AI agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchDashboardData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Smart Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Processed by AI agents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(analytics?.successRate || 0, 'successRate')}`}>
                  {analytics?.successRate.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Accurate decisions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(analytics?.averageExecutionTime || 0, 'executionTime')}`}>
                  {((analytics?.averageExecutionTime || 0) / 1000).toFixed(1)}s
                </div>
                <p className="text-xs text-muted-foreground">
                  Response time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  $2,500
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly opportunity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Spending Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Next Month Forecast</span>
                    <span className="font-bold">$25,000</span>
                  </div>
                  <Progress value={85} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    85% confidence based on seasonal trends, historical patterns
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Fraud Risk</span>
                    <Badge className="text-green-600">15%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Budget Overrun Risk</span>
                    <Badge className="text-yellow-600">25%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {analytics?.agentPerformance.map((agent) => (
              <Card key={agent.agentId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAgentIcon(agent.agentId)}
                    {getAgentDisplayName(agent.agentId)}
                  </CardTitle>
                  <CardDescription>
                    {agent.totalDecisions} decisions made • Last updated {new Date(agent.lastUpdated).toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className={`font-bold ${getPerformanceColor(agent.successRate, 'successRate')}`}>
                          {agent.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={agent.successRate} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Confidence</span>
                        <span className={`font-bold ${getPerformanceColor(agent.averageConfidence, 'confidence')}`}>
                          {agent.averageConfidence.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={agent.averageConfidence} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Execution Time</span>
                        <span className={`font-bold ${getPerformanceColor(agent.averageExecutionTime, 'executionTime')}`}>
                          {(agent.averageExecutionTime / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((5000 - agent.averageExecutionTime) / 5000 * 100, 100)} 
                        className="w-full" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Smart Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h5 className="font-medium text-blue-900">Automation Opportunity</h5>
                  <p className="text-sm text-blue-700">
                    78% of office supply requests under $100 are approved. Consider auto-approval for faster processing.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h5 className="font-medium text-green-900">Cost Optimization</h5>
                  <p className="text-sm text-green-700">
                    Software subscriptions show 20% better rates when negotiated annually vs monthly.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h5 className="font-medium text-yellow-900">Risk Mitigation</h5>
                  <p className="text-sm text-yellow-700">
                    High-value travel requests ($2000+) have 15% higher fraud risk. Enable additional verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Insights */}
          <div className="space-y-4">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Your monthly spending is 20% above industry average. Consider reviewing budget allocations.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Your approval time is 50% slower than industry average. Consider automating more requests.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastRefresh.toLocaleString()} • Auto-refreshes every 30 seconds
      </div>
    </div>
  )
} 