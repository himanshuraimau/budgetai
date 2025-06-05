"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAgentDashboard } from "@/components/dashboard/ai-agent-dashboard"
import { AINotificationCenter } from "@/components/notifications/ai-notification-center"
import { EnhancedPurchaseRequestForm } from "@/components/forms/enhanced-purchase-request-form"
import { SmartReimbursementForm } from "@/components/forms/smart-reimbursement-form"
import { 
  Brain, 
  Zap, 
  Receipt, 
  BarChart3,
  Bell,
  Settings
} from "lucide-react"

export default function AIPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8" />
            AI-Powered Budget Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Experience the future of expense management with intelligent automation
          </p>
        </div>
        <AINotificationCenter />
      </div>

      {/* AI Features Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Instant Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI agents make approval decisions in seconds, not days. 95% accuracy with continuous learning.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-500" />
              Smart Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload receipts for automatic data extraction, categorization, and fraud detection.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cross-company learning provides spending predictions and cost optimization recommendations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main AI Interface */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Requests
          </TabsTrigger>
          <TabsTrigger value="reimbursements" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Smart Reimbursements
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Agent Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI-Powered Purchase Requests</h2>
              <EnhancedPurchaseRequestForm />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    How AI Helps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Instant Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Budget Guardian analyzes your request against budgets, policies, and spending patterns
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Smart Approval</h4>
                        <p className="text-sm text-muted-foreground">
                          Universal Approval Agent makes decisions using cross-company intelligence
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Instant Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          Payment Execution Agent transfers funds directly to vendor or employee wallet
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Office Supplies - $85</p>
                        <p className="text-sm text-green-600">Approved in 2.3s</p>
                      </div>
                      <div className="text-green-600 font-bold">✓</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Software License - $299</p>
                        <p className="text-sm text-blue-600">Payment executing...</p>
                      </div>
                      <div className="text-blue-600">⚡</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Travel - $2,500</p>
                        <p className="text-sm text-yellow-600">Escalated for review</p>
                      </div>
                      <div className="text-yellow-600">⚠</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reimbursements" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Smart Reimbursements</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Coming Soon: Smart Reimbursement Processing
                  </CardTitle>
                  <CardDescription>
                    Upload receipts for instant AI analysis and automatic payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                      <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium">Intelligent Receipt Processing</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        AI extracts amount, vendor, date, and category automatically
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900">Fraud Detection</h4>
                        <p className="text-sm text-blue-700">
                          Cross-company pattern analysis identifies suspicious submissions
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900">Instant Payment</h4>
                        <p className="text-sm text-green-700">
                          Approved reimbursements paid to your wallet in seconds
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reimbursement Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Processing Time</span>
                      <span className="text-sm font-bold">3.2 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fraud Detection Rate</span>
                      <span className="text-sm font-bold">99.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auto-Approval Rate</span>
                      <span className="text-sm font-bold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employee Satisfaction</span>
                      <span className="text-sm font-bold">4.9/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Meals & Entertainment</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Travel</span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transportation</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Office Supplies</span>
                      <span className="text-sm text-muted-foreground">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AIAgentDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>
                  Configure AI agent behavior and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-approval threshold</span>
                    <span className="text-sm">$500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk tolerance</span>
                    <span className="text-sm">Medium</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Learning mode</span>
                    <span className="text-sm">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cross-company insights</span>
                    <span className="text-sm">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>
                  Current AI agent status and health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Guardian</span>
                    <span className="text-sm text-green-600">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Universal Approval</span>
                    <span className="text-sm text-green-600">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Execution</span>
                    <span className="text-sm text-green-600">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Smart Reimbursement</span>
                    <span className="text-sm text-yellow-600">● Updating</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 