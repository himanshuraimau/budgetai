import { BaseAgent, AgentRequest, AgentResponse, AgentContext, AgentMetrics, AgentCapabilities, AgentFeedback } from './types';
import { paymanService } from '../payman/client';
import { Company } from '../../db/models/Company';
import { IUser } from '../../db/models/User';

interface ExpenseAnalysis {
  category: string;
  amount: number;
  legitimacy: number; // 0-100 score
  riskFactors: string[];
  patterns: {
    similarExpenses: number;
    employeeHistory: string[];
    departmentAverages: number;
  };
}

interface ReimbursementValidation {
  valid: boolean;
  reason?: string;
  requiredApprovals?: string[];
  fraudScore: number; // 0-100, higher = more suspicious
}

export class SmartReimbursementAgent extends BaseAgent {
  readonly id = 'smart-reimbursement';
  readonly name = 'Smart Reimbursement Agent';
  readonly capabilities: AgentCapabilities = {
    canApprovePayments: true,
    canExecutePayments: true,
    canAnalyzeBudgets: true,
    canDetectFraud: true,
    canPredictsSpending: true,
    maxDecisionAmount: 5000, // Can auto-approve reimbursements up to $5k
    supportedCategories: ['travel', 'office-supplies', 'meals', 'software', 'training', 'equipment']
  };

  async processRequest(request: AgentRequest, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      if (request.type !== 'reimbursement') {
        return {
          requestId: request.id,
          agentId: this.id,
          decision: 'deny',
          confidence: 99,
          reasoning: 'Can only process reimbursement requests',
          riskLevel: 'medium',
          executionTime: Date.now() - startTime
        };
      }

      // Analyze the expense
      const analysis = await this.analyzeExpense(request, context);
      
      // Validate reimbursement eligibility
      const validation = await this.validateReimbursement(request, context, analysis);
      
      if (!validation.valid) {
        return {
          requestId: request.id,
          agentId: this.id,
          decision: 'escalate',
          confidence: 80,
          reasoning: validation.reason || 'Reimbursement validation failed',
          suggestedActions: validation.requiredApprovals || ['manual_review'],
          riskLevel: validation.fraudScore > 70 ? 'high' : 'medium',
          executionTime: Date.now() - startTime
        };
      }

      // Execute instant reimbursement if under threshold and low risk
      if (request.data.amount <= this.capabilities.maxDecisionAmount && validation.fraudScore < 30) {
        const paymentResult = await this.executeReimbursement(request, context);
        
        return {
          requestId: request.id,
          agentId: this.id,
          decision: paymentResult.success ? 'approve' : 'deny',
          confidence: paymentResult.success ? 95 : 70,
          reasoning: paymentResult.reason,
          paymentExecuted: paymentResult.success,
          suggestedActions: paymentResult.suggestedActions,
          riskLevel: 'low',
          estimatedCost: request.data.amount,
          executionTime: Date.now() - startTime
        };
      }

      // Approve but don't execute (requires higher approval)
      return {
        requestId: request.id,
        agentId: this.id,
        decision: 'approve',
        confidence: 85,
        reasoning: `Reimbursement validated but requires manual approval (Amount: $${request.data.amount}, Fraud Score: ${validation.fraudScore})`,
        suggestedActions: ['manager_approval'],
        riskLevel: validation.fraudScore > 50 ? 'medium' : 'low',
        estimatedCost: request.data.amount,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('SmartReimbursementAgent error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        requestId: request.id,
        agentId: this.id,
        decision: 'escalate',
        confidence: 0,
        reasoning: `Reimbursement processing failed: ${errorMessage}`,
        riskLevel: 'high',
        executionTime: Date.now() - startTime
      };
    }
  }

  async getMetrics(): Promise<AgentMetrics> {
    // Mock implementation - replace with actual metrics calculation
    return {
      agentId: this.id,
      totalDecisions: 1250,
      accuracyRate: 94.2,
      averageResponseTime: 1800,
      approvalRate: 78.5,
      costSavings: 125000,
      riskMitigated: 85.3,
      lastActiveAt: new Date()
    };
  }

  async updateLearning(feedback: AgentFeedback): Promise<void> {
    // Implementation for updating the agent's learning model
    console.log(`Updating reimbursement agent learning with feedback for request ${feedback.requestId}`);
    
    // Here you would:
    // 1. Store the feedback in the database
    // 2. Update the ML model weights
    // 3. Adjust decision thresholds based on feedback
    // 4. Update fraud detection patterns
    
    // Mock implementation for now
    const feedbackWeight = feedback.userSatisfaction / 5.0;
    console.log(`Applied feedback weight: ${feedbackWeight} for outcome: ${feedback.actualOutcome}`);
  }

  /**
   * Analyze expense using platform-wide patterns
   */
  private async analyzeExpense(request: AgentRequest, context: AgentContext): Promise<ExpenseAnalysis> {
    const { amount, category, receipt, description } = request.data;
    
    // Get employee's expense history
    const employeeHistory = await this.getEmployeeExpenseHistory(context.employeeId || '', category);
    
    // Get department averages across all companies
    const departmentAverages = await this.getDepartmentAverages(context.companyId, category);
    
    // Find similar expenses across platform
    const similarExpenses = await this.findSimilarExpenses(amount, category, description);
    
    // Calculate legitimacy score
    const legitimacy = this.calculateLegitimacyScore(amount, category, employeeHistory, departmentAverages);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(amount, category, receipt, employeeHistory);
    
    return {
      category,
      amount,
      legitimacy,
      riskFactors,
      patterns: {
        similarExpenses: similarExpenses.length,
        employeeHistory: employeeHistory.map(e => `${e.category}: $${e.amount}`),
        departmentAverages
      }
    };
  }

  /**
   * Validate reimbursement eligibility and detect fraud
   */
  private async validateReimbursement(
    request: AgentRequest, 
    context: AgentContext, 
    analysis: ExpenseAnalysis
  ): Promise<ReimbursementValidation> {
    const { amount, receipt, date, category } = request.data;
    
    // Basic validation checks
    const validationErrors: string[] = [];
    
    if (!receipt || !receipt.url) {
      validationErrors.push('Receipt required for reimbursement');
    }
    
    if (!date || new Date(date) > new Date()) {
      validationErrors.push('Invalid or future expense date');
    }
    
    if (amount <= 0) {
      validationErrors.push('Invalid expense amount');
    }
    
    // Check company policy limits
    const policyLimit = await this.getCompanyPolicyLimit(context.companyId, category);
    if (amount > policyLimit) {
      validationErrors.push(`Amount exceeds company policy limit of $${policyLimit} for ${category}`);
    }
    
    // Calculate fraud score
    const fraudScore = this.calculateFraudScore(request, context, analysis);
    
    return {
      valid: validationErrors.length === 0 && fraudScore < 80,
      reason: validationErrors.length > 0 ? validationErrors.join('; ') : undefined,
      requiredApprovals: fraudScore > 50 ? ['manager_approval'] : undefined,
      fraudScore
    };
  }

  /**
   * Execute instant reimbursement transfer
   */
  private async executeReimbursement(request: AgentRequest, context: AgentContext): Promise<{
    success: boolean;
    reason: string;
    suggestedActions?: string[];
  }> {
    try {
      const { amount, description, category } = request.data;
      
      // Get employee information to check wallet
      const employee = await this.getEmployeeById(context.employeeId || '');
      if (!employee?.paymanWalletId) {
        return {
          success: false,
          reason: 'Employee wallet not found',
          suggestedActions: ['setup_wallet']
        };
      }
      
      // Create a payee for the employee if needed
      const payee = await paymanService.createPayee(
        employee.name,
        employee.email,
        'test'
      );
      
      // Execute payment via Payman
      const companyWallet = await this.getCompanyWallet(context.companyId);
      const transferResult = await paymanService.sendPayment(
        companyWallet.id,
        payee.id,
        amount,
        `Reimbursement: ${description} (Category: ${category})`,
        request.id
      );
      
      if (transferResult && !transferResult.error) {
        // Record the reimbursement in database
        await this.recordReimbursement(request, context, transferResult.transactionId || 'test-tx');
        
        // Update employee's expense record
        await this.updateExpenseRecord(request, context, 'reimbursed');
        
        return {
          success: true,
          reason: `Reimbursement of $${amount} successfully transferred to employee wallet`
        };
      } else {
        return {
          success: false,
          reason: `Payment transfer failed: ${transferResult?.error || 'Unknown error'}`,
          suggestedActions: ['retry_payment', 'manual_transfer']
        };
      }
      
    } catch (error) {
      console.error('Reimbursement execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        reason: `Reimbursement execution failed: ${errorMessage}`,
        suggestedActions: ['retry_payment', 'manual_review']
      };
    }
  }

  /**
   * Calculate fraud score based on multiple factors
   */
  private calculateFraudScore(request: AgentRequest, context: AgentContext, analysis: ExpenseAnalysis): number {
    let score = 0;
    
    // Amount-based risk
    if (request.data.amount > 1000) score += 20;
    if (request.data.amount > 2500) score += 20;
    
    // Frequency-based risk
    const recentExpenses = analysis.patterns.employeeHistory.filter(e => 
      e.includes(request.data.category)
    ).length;
    if (recentExpenses > 5) score += 15;
    if (recentExpenses > 10) score += 25;
    
    // Pattern deviation risk
    if (analysis.legitimacy < 50) score += 30;
    if (analysis.legitimacy < 30) score += 40;
    
    // Risk factors
    score += analysis.riskFactors.length * 10;
    
    // Time-based risk (weekend/holiday submissions)
    const submissionDate = new Date(request.timestamp);
    if (submissionDate.getDay() === 0 || submissionDate.getDay() === 6) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  /**
   * Calculate expense legitimacy based on patterns
   */
  private calculateLegitimacyScore(
    amount: number, 
    category: string, 
    employeeHistory: any[], 
    departmentAverage: number
  ): number {
    let score = 50; // Base score
    
    // Compare to employee's historical spending
    const avgEmployeeSpend = employeeHistory.reduce((sum, exp) => sum + exp.amount, 0) / employeeHistory.length;
    if (amount <= avgEmployeeSpend * 1.5) score += 20;
    if (amount <= avgEmployeeSpend) score += 30;
    
    // Compare to department average
    if (amount <= departmentAverage * 1.2) score += 20;
    if (amount <= departmentAverage) score += 30;
    
    // Category-specific scoring
    switch (category) {
      case 'meals':
        if (amount <= 100) score += 20;
        break;
      case 'travel':
        if (amount <= 2000) score += 15;
        break;
      case 'office-supplies':
        if (amount <= 500) score += 25;
        break;
    }
    
    return Math.min(score, 100);
  }

  /**
   * Identify risk factors in the expense
   */
  private identifyRiskFactors(amount: number, category: string, receipt: any, employeeHistory: any[]): string[] {
    const risks: string[] = [];
    
    if (!receipt || !receipt.url) {
      risks.push('Missing receipt');
    }
    
    if (amount > 2500) {
      risks.push('High amount');
    }
    
    // Check for duplicate submissions
    const duplicateRisk = employeeHistory.some(exp => 
      Math.abs(exp.amount - amount) < 1 && 
      exp.category === category &&
      new Date(exp.date).getTime() === new Date(receipt?.date || Date.now()).getTime()
    );
    if (duplicateRisk) {
      risks.push('Potential duplicate');
    }
    
    // Round number risk
    if (amount % 10 === 0 && amount > 100) {
      risks.push('Round amount');
    }
    
    return risks;
  }

  /**
   * Platform learning methods
   */
  private async getEmployeeExpenseHistory(employeeId: string, category: string): Promise<any[]> {
    // Mock implementation - replace with actual database query
    return [];
  }

  private async getDepartmentAverages(companyId: string, category: string): Promise<number> {
    // Mock implementation - replace with actual cross-company analytics
    return 500;
  }

  private async findSimilarExpenses(amount: number, category: string, description: string): Promise<any[]> {
    // Mock implementation - replace with actual platform-wide pattern matching
    return [];
  }

  private async getCompanyPolicyLimit(companyId: string, category: string): Promise<number> {
    // Mock implementation - replace with actual policy lookup
    return 2500;
  }

  private async getEmployeeById(employeeId: string): Promise<IUser | null> {
    // Mock implementation - replace with actual database query
    return {
      id: employeeId,
      email: 'employee@company.com',
      name: 'John Doe',
      role: 'employee',
      password: 'hashed',
      paymanWalletId: 'wallet-123',
      onboardingCompleted: true,
      notificationsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    } as IUser;
  }

  private async getCompanyWallet(companyId: string): Promise<{ id: string }> {
    // Mock implementation - replace with actual company wallet lookup
    return { id: 'company-wallet-123' };
  }

  private async recordReimbursement(request: AgentRequest, context: AgentContext, transactionId: string): Promise<void> {
    // Implementation to record reimbursement in database
    console.log(`Recording reimbursement: ${request.id} -> ${transactionId}`);
  }

  private async updateExpenseRecord(request: AgentRequest, context: AgentContext, status: string): Promise<void> {
    // Implementation to update expense record status
    console.log(`Updating expense record ${request.id} status to: ${status}`);
  }

  /**
   * Batch reimbursement processing
   */
  async processBatchReimbursements(requests: AgentRequest[], context: AgentContext): Promise<{
    successful: number;
    failed: number;
    totalAmount: number;
    results: AgentResponse[];
  }> {
    const results: AgentResponse[] = [];
    let successful = 0;
    let failed = 0;
    let totalAmount = 0;

    for (const request of requests) {
      try {
        const result = await this.processRequest(request, context);
        results.push(result);
        
        if (result.paymentExecuted) {
          successful++;
          totalAmount += request.data.amount;
        } else {
          failed++;
        }

        // Small delay between reimbursements
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`Batch reimbursement failed for request ${request.id}:`, error);
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        results.push({
          requestId: request.id,
          agentId: this.id,
          decision: 'deny',
          confidence: 0,
          reasoning: `Batch reimbursement failed: ${errorMessage}`,
          riskLevel: 'high',
          paymentExecuted: false
        });
      }
    }

    return { successful, failed, totalAmount, results };
  }

  /**
   * Learn from reimbursement patterns across companies
   */
  async updateLearningModel(feedbacks: AgentFeedback[]): Promise<void> {
    // Implementation for cross-company pattern learning
    // This would update ML models based on successful/failed reimbursements
    console.log(`Updating reimbursement learning model with ${feedbacks.length} feedback entries`);
  }
} 