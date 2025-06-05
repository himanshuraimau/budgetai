// Core AI Agent Types and Interfaces

export interface AgentRequest {
  id: string;
  companyId: string;
  requestId: string;
  type: 'approval' | 'payment' | 'reimbursement' | 'budget_analysis';
  data: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  requestId: string;
  agentId: string;
  decision: 'approve' | 'deny' | 'escalate' | 'analyze';
  confidence: number; // 0-100
  reasoning: string;
  suggestedActions?: string[];
  paymentExecuted?: boolean;
  estimatedCost?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  recommendedApprover?: string;
  executionTime?: number; // milliseconds
}

export interface AgentContext {
  companyId: string;
  employeeId?: string;
  departmentId?: string;
  currentBudget: BudgetContext;
  spendingHistory: SpendingPattern[];
  companyPolicies: PolicyContext;
  requestHistory: RequestHistoryItem[];
}

export interface BudgetContext {
  companyMonthlyBudget: number;
  departmentMonthlyBudget: number;
  currentMonthSpent: number;
  remainingBudget: number;
  projectedMonthlySpend: number;
  dayOfMonth: number;
  daysLeftInMonth: number;
}

export interface SpendingPattern {
  category: string;
  averageAmount: number;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality?: string;
  vendorReputation?: number;
}

export interface PolicyContext {
  dailyLimit: number;
  transactionLimit: number;
  approvalThreshold: number;
  allowedCategories: string[];
  restrictedVendors?: string[];
  autoApprovalRules: AutoApprovalRule[];
}

export interface AutoApprovalRule {
  condition: string;
  maxAmount: number;
  categories: string[];
  requiredJustification: boolean;
}

export interface RequestHistoryItem {
  requestId: string;
  amount: number;
  category: string;
  approved: boolean;
  reason: string;
  timestamp: Date;
  paymentExecuted: boolean;
}

export interface AgentMetrics {
  agentId: string;
  totalDecisions: number;
  accuracyRate: number;
  averageResponseTime: number;
  approvalRate: number;
  costSavings: number;
  riskMitigated: number;
  lastActiveAt: Date;
}

export interface AgentCapabilities {
  canApprovePayments: boolean;
  canExecutePayments: boolean;
  canAnalyzeBudgets: boolean;
  canDetectFraud: boolean;
  canPredictsSpending: boolean;
  maxDecisionAmount: number;
  supportedCategories: string[];
}

// Base Agent Interface
export abstract class BaseAgent {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly capabilities: AgentCapabilities;
  
  abstract processRequest(request: AgentRequest, context: AgentContext): Promise<AgentResponse>;
  abstract getMetrics(): Promise<AgentMetrics>;
  abstract updateLearning(feedback: AgentFeedback): Promise<void>;
}

export interface AgentFeedback {
  requestId: string;
  request: AgentRequest; // Include full request for pattern analysis
  actualOutcome: 'correct' | 'incorrect' | 'partial';
  actualCost?: number;
  userSatisfaction: number; // 1-5
  notes?: string;
}

// Agent Communication
export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent?: string; // undefined means broadcast
  type: 'request' | 'response' | 'notification' | 'escalation';
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  expiresAt?: Date;
}

export interface AgentCollaboration {
  primaryAgent: string;
  supportingAgents: string[];
  collaborationType: 'consensus' | 'escalation' | 'specialist_consultation';
  requiredVotes?: number;
  timeoutMs: number;
}

// Decision Making
export interface DecisionContext {
  request: AgentRequest;
  context: AgentContext;
  similarRequests: RequestHistoryItem[];
  riskFactors: RiskFactor[];
  budgetImpact: BudgetImpact;
  companyGoals: CompanyGoal[];
}

export interface RiskFactor {
  type: 'budget_overrun' | 'vendor_risk' | 'unusual_pattern' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string;
}

export interface BudgetImpact {
  percentageOfBudget: number;
  impactOnProjections: number;
  alternativeSolutions: string[];
  costBenefit: number;
}

export interface CompanyGoal {
  type: 'cost_reduction' | 'growth' | 'efficiency' | 'compliance';
  target: number;
  currentProgress: number;
  relevance: number; // how relevant this goal is to the current request
} 