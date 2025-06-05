import { BaseAgent, AgentRequest, AgentResponse, AgentContext, AgentMetrics, AgentCapabilities, AgentFeedback, BudgetImpact, RiskFactor } from './types';
import { Company } from '../../db/models/Company';
import { User } from '../../db/models/User';
import { PurchaseRequest } from '../../db/models/PurchaseRequest';

export class BudgetGuardianAgent extends BaseAgent {
  readonly id = 'budget-guardian';
  readonly name = 'Budget Guardian';
  readonly capabilities: AgentCapabilities = {
    canApprovePayments: false, // Guardian only analyzes, doesn't approve
    canExecutePayments: false,
    canAnalyzeBudgets: true,
    canDetectFraud: true,
    canPredictsSpending: true,
    maxDecisionAmount: Infinity, // Can analyze any amount
    supportedCategories: ['*'] // All categories
  };

  async processRequest(request: AgentRequest, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const analysis = await this.analyzeBudgetImpact(request, context);
      const riskFactors = await this.identifyRiskFactors(request, context);
      const predictions = await this.predictSpendingTrends(context);
      
      const decision = this.makeRecommendation(analysis, riskFactors, predictions);
      
      return {
        requestId: request.id,
        agentId: this.id,
        decision: decision.decision,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        suggestedActions: decision.suggestedActions,
        riskLevel: decision.riskLevel,
        estimatedCost: analysis.totalImpact,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('BudgetGuardianAgent error:', error);
      return {
        requestId: request.id,
        agentId: this.id,
        decision: 'escalate',
        confidence: 0,
        reasoning: `Analysis failed: ${(error as Error).message}`,
        riskLevel: 'high',
        executionTime: Date.now() - startTime
      };
    }
  }

  private async analyzeBudgetImpact(request: AgentRequest, context: AgentContext): Promise<BudgetImpact & { totalImpact: number }> {
    const requestAmount = request.data.amount || 0;
    
    // Calculate budget impact
    const percentageOfBudget = (requestAmount / context.currentBudget.remainingBudget) * 100;
    
    // Project impact on monthly spending
    const dailyBurnRate = context.currentBudget.currentMonthSpent / context.currentBudget.dayOfMonth;
    const projectedMonthlySpend = dailyBurnRate * 30; // Assume 30 days
    const impactOnProjections = ((projectedMonthlySpend + requestAmount) / context.currentBudget.companyMonthlyBudget) * 100;
    
    // Suggest alternatives
    const alternativeSolutions = this.generateAlternatives(request, context);
    
    // Calculate cost-benefit ratio
    const costBenefit = this.calculateCostBenefit(request, context);
    
    return {
      percentageOfBudget,
      impactOnProjections,
      alternativeSolutions,
      costBenefit,
      totalImpact: requestAmount
    };
  }

  private async identifyRiskFactors(request: AgentRequest, context: AgentContext): Promise<RiskFactor[]> {
    const risks: RiskFactor[] = [];
    const requestAmount = request.data.amount || 0;
    
    // Budget overrun risk
    if (context.currentBudget.remainingBudget < requestAmount) {
      risks.push({
        type: 'budget_overrun',
        severity: 'critical',
        description: `Request exceeds remaining budget by $${requestAmount - context.currentBudget.remainingBudget}`,
        mitigation: 'Require additional budget approval or defer to next month'
      });
    } else if ((requestAmount / context.currentBudget.remainingBudget) > 0.5) {
      risks.push({
        type: 'budget_overrun',
        severity: 'high',
        description: `Request uses ${((requestAmount / context.currentBudget.remainingBudget) * 100).toFixed(1)}% of remaining budget`,
        mitigation: 'Consider phased implementation or reduced scope'
      });
    }

    // Unusual spending pattern
    const avgCategorySpending = context.spendingHistory
      .filter(p => p.category === request.data.category)
      .reduce((sum, p) => sum + p.averageAmount, 0) / 
      (context.spendingHistory.filter(p => p.category === request.data.category).length || 1);
    
    if (requestAmount > avgCategorySpending * 3) {
      risks.push({
        type: 'unusual_pattern',
        severity: 'medium',
        description: `Request is ${(requestAmount / avgCategorySpending).toFixed(1)}x larger than typical ${request.data.category} spending`,
        mitigation: 'Verify necessity and get additional justification'
      });
    }

    // Policy violation check
    if (!context.companyPolicies.allowedCategories.includes(request.data.category)) {
      risks.push({
        type: 'policy_violation',
        severity: 'high',
        description: `Category "${request.data.category}" is not in allowed categories`,
        mitigation: 'Get policy exception approval or recategorize request'
      });
    }

    // Transaction limit check
    if (requestAmount > context.companyPolicies.transactionLimit) {
      risks.push({
        type: 'policy_violation',
        severity: 'medium',
        description: `Amount exceeds transaction limit of $${context.companyPolicies.transactionLimit}`,
        mitigation: 'Split into smaller requests or get manager approval'
      });
    }

    return risks;
  }

  private async predictSpendingTrends(context: AgentContext): Promise<{ trendAnalysis: string; predictions: string[] }> {
    // Calculate spending velocity
    const currentVelocity = context.currentBudget.currentMonthSpent / context.currentBudget.dayOfMonth;
    const projectedEndOfMonth = currentVelocity * 30;
    
    const predictions: string[] = [];
    
    if (projectedEndOfMonth > context.currentBudget.companyMonthlyBudget * 1.1) {
      predictions.push(`Projected 10%+ budget overrun by month end ($${(projectedEndOfMonth - context.currentBudget.companyMonthlyBudget).toFixed(0)} over)`);
    } else if (projectedEndOfMonth > context.currentBudget.companyMonthlyBudget) {
      predictions.push(`Projected to exceed budget by $${(projectedEndOfMonth - context.currentBudget.companyMonthlyBudget).toFixed(0)}`);
    }

    // Analyze category trends
    context.spendingHistory.forEach(pattern => {
      if (pattern.trend === 'increasing' && pattern.frequency > 5) {
        predictions.push(`${pattern.category} spending trending up - consider budget reallocation`);
      }
    });

    const trendAnalysis = `Current burn rate: $${currentVelocity.toFixed(0)}/day. Projected month-end spend: $${projectedEndOfMonth.toFixed(0)}`;
    
    return { trendAnalysis, predictions };
  }

  private makeRecommendation(
    analysis: BudgetImpact & { totalImpact: number }, 
    risks: RiskFactor[], 
    predictions: { trendAnalysis: string; predictions: string[] }
  ) {
    const criticalRisks = risks.filter(r => r.severity === 'critical');
    const highRisks = risks.filter(r => r.severity === 'high');
    
    let decision: 'approve' | 'deny' | 'escalate' | 'analyze' = 'analyze';
    let confidence = 85;
    let reasoning = '';
    let suggestedActions: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (criticalRisks.length > 0) {
      decision = 'deny';
      confidence = 95;
      riskLevel = 'critical';
      reasoning = `Critical budget risks identified: ${criticalRisks.map(r => r.description).join('; ')}`;
      suggestedActions = criticalRisks.map(r => r.mitigation || '').filter(Boolean);
    } else if (highRisks.length > 0) {
      decision = 'escalate';
      confidence = 80;
      riskLevel = 'high';
      reasoning = `High-risk factors require management review: ${highRisks.map(r => r.description).join('; ')}`;
      suggestedActions = [...highRisks.map(r => r.mitigation || '').filter(Boolean), 'Get manager approval'];
    } else if (analysis.percentageOfBudget > 25) {
      decision = 'escalate';
      confidence = 75;
      riskLevel = 'medium';
      reasoning = `Large budget impact (${analysis.percentageOfBudget.toFixed(1)}% of remaining budget) requires review`;
      suggestedActions = ['Get department head approval', 'Consider budget reallocation'];
    } else if (analysis.costBenefit > 0.8) {
      decision = 'approve';
      confidence = 90;
      riskLevel = 'low';
      reasoning = `Good cost-benefit ratio (${analysis.costBenefit.toFixed(2)}) with manageable budget impact`;
      suggestedActions = ['Proceed with purchase', 'Monitor category spending'];
    } else {
      decision = 'analyze';
      confidence = 70;
      riskLevel = 'medium';
      reasoning = `Moderate impact requiring additional analysis. ${predictions.trendAnalysis}`;
      suggestedActions = ['Request additional justification', 'Compare alternatives'];
    }

    // Add trend-based suggestions
    if (predictions.predictions.length > 0) {
      suggestedActions.push(...predictions.predictions);
    }

    return {
      decision,
      confidence,
      reasoning,
      suggestedActions: [...new Set(suggestedActions)], // Remove duplicates
      riskLevel
    };
  }

  private generateAlternatives(request: AgentRequest, context: AgentContext): string[] {
    const alternatives: string[] = [];
    const amount = request.data.amount || 0;
    
    // Suggest lower-cost alternatives
    if (amount > 1000) {
      alternatives.push('Consider phased implementation to spread cost over multiple months');
      alternatives.push('Explore lower-cost vendors or solutions');
    }
    
    // Category-specific alternatives
    const category = request.data.category;
    if (category === 'Software') {
      alternatives.push('Check for existing licenses or free alternatives');
      alternatives.push('Consider annual vs monthly pricing');
    } else if (category === 'Equipment') {
      alternatives.push('Explore leasing vs purchasing options');
      alternatives.push('Consider refurbished or previous-generation models');
    } else if (category === 'Marketing') {
      alternatives.push('Start with smaller test campaign');
      alternatives.push('Use internal resources vs external agency');
    }
    
    return alternatives;
  }

  private calculateCostBenefit(request: AgentRequest, context: AgentContext): number {
    // Simplified cost-benefit calculation
    // In a real implementation, this would use more sophisticated modeling
    
    const amount = request.data.amount || 0;
    const category = request.data.category;
    const urgency = request.data.urgency || 'medium';
    
    let benefit = 0.5; // Base benefit score
    
    // Category-based benefit multipliers
    const categoryMultipliers = {
      'Software': 0.8,      // High efficiency gains
      'Equipment': 0.7,     // Long-term value
      'Marketing': 0.6,     // Revenue potential
      'Training': 0.9,      // High ROI
      'Utilities': 0.5,     // Necessary but not value-adding
      'Office Supplies': 0.3, // Low direct benefit
    };
    
    benefit *= categoryMultipliers[category as keyof typeof categoryMultipliers] || 0.5;
    
    // Urgency adjustment
    if (urgency === 'high') benefit *= 1.2;
    if (urgency === 'low') benefit *= 0.8;
    
    // Size adjustment (smaller requests often have better ROI)
    if (amount < 500) benefit *= 1.1;
    if (amount > 5000) benefit *= 0.9;
    
    return Math.min(1.0, benefit); // Cap at 1.0
  }

  async getMetrics(): Promise<AgentMetrics> {
    // This would typically query a metrics database
    // For now, return mock data
    return {
      agentId: this.id,
      totalDecisions: 1247,
      accuracyRate: 92.3,
      averageResponseTime: 1250, // ms
      approvalRate: 0, // Guardian doesn't approve, only analyzes
      costSavings: 45600, // Estimated savings from recommendations
      riskMitigated: 23, // Number of risks prevented
      lastActiveAt: new Date()
    };
  }

  async updateLearning(feedback: AgentFeedback): Promise<void> {
    // In a real implementation, this would update ML models
    // For now, just log the feedback
    console.log(`BudgetGuardianAgent learning update:`, {
      requestId: feedback.requestId,
      outcome: feedback.actualOutcome,
      satisfaction: feedback.userSatisfaction
    });
    
    // Could update decision weights, thresholds, etc. based on feedback
  }
} 