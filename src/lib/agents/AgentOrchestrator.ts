import { BaseAgent, AgentRequest, AgentResponse, AgentContext, AgentMetrics, AgentFeedback } from './types';
import { RequestValidationAgent } from './RequestValidationAgent';
import { BudgetGuardianAgent } from './BudgetGuardianAgent';
import { UniversalApprovalAgent } from './UniversalApprovalAgent';
import { PaymentExecutionAgent } from './PaymentExecutionAgent';
import { SmartReimbursementAgent } from './SmartReimbursementAgent';

interface WorkflowStep {
  agentId: string;
  agent: BaseAgent;
  required: boolean;
  condition?: (context: AgentContext, previousResults: AgentResponse[]) => boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  requestTypes: string[];
}

interface OrchestrationResult {
  success: boolean;
  finalDecision: 'approve' | 'deny' | 'escalate';
  confidence: number;
  reasoning: string;
  agentResponses: AgentResponse[];
  executionTime: number;
  paymentExecuted?: boolean;
  totalCost?: number;
}

interface AgentPerformance {
  agentId: string;
  successRate: number;
  averageConfidence: number;
  averageExecutionTime: number;
  totalDecisions: number;
  lastUpdated: Date;
}

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private performanceMetrics: Map<string, AgentPerformance> = new Map();
  private learningData: AgentFeedback[] = [];

  constructor() {
    this.initializeAgents();
    this.initializeWorkflows();
  }

  /**
   * Initialize all AI agents
   */
  private initializeAgents(): void {
    const requestValidation = new RequestValidationAgent();
    const budgetGuardian = new BudgetGuardianAgent();
    const universalApproval = new UniversalApprovalAgent();
    const paymentExecution = new PaymentExecutionAgent();
    const smartReimbursement = new SmartReimbursementAgent();

    this.agents.set(requestValidation.id, requestValidation);
    this.agents.set(budgetGuardian.id, budgetGuardian);
    this.agents.set(universalApproval.id, universalApproval);
    this.agents.set(paymentExecution.id, paymentExecution);
    this.agents.set(smartReimbursement.id, smartReimbursement);

    // Initialize performance metrics
    for (const [agentId] of this.agents) {
      this.performanceMetrics.set(agentId, {
        agentId,
        successRate: 100,
        averageConfidence: 85,
        averageExecutionTime: 1000,
        totalDecisions: 0,
        lastUpdated: new Date()
      });
    }
  }

  /**
   * Initialize predefined workflows
   */
  private initializeWorkflows(): void {
    // Purchase Request Workflow
    this.workflows.set('purchase-request', {
      id: 'purchase-request',
      name: 'Purchase Request Processing',
      description: 'Full purchase request analysis, approval, and payment execution',
      requestTypes: ['approval', 'payment'],
      steps: [
        {
          agentId: 'request-validation',
          agent: this.agents.get('request-validation')!,
          required: true
        },
        {
          agentId: 'budget-guardian',
          agent: this.agents.get('budget-guardian')!,
          required: true,
          condition: (context, results) => {
            const validationResult = results.find(r => r.agentId === 'request-validation');
            return validationResult?.decision !== 'deny';
          }
        },
        {
          agentId: 'universal-approval',
          agent: this.agents.get('universal-approval')!,
          required: true,
          condition: (context, results) => {
            const budgetResult = results.find(r => r.agentId === 'budget-guardian');
            return budgetResult?.decision !== 'deny';
          }
        },
        {
          agentId: 'payment-execution',
          agent: this.agents.get('payment-execution')!,
          required: false,
          condition: (context, results) => {
            const approvalResult = results.find(r => r.agentId === 'universal-approval');
            return approvalResult?.decision === 'approve';
          }
        }
      ]
    });

    // Reimbursement Workflow
    this.workflows.set('reimbursement', {
      id: 'reimbursement',
      name: 'Smart Reimbursement Processing',
      description: 'Automated reimbursement analysis and instant transfer',
      requestTypes: ['reimbursement'],
      steps: [
        {
          agentId: 'smart-reimbursement',
          agent: this.agents.get('smart-reimbursement')!,
          required: true
        }
      ]
    });

    // Budget Analysis Workflow
    this.workflows.set('budget-analysis', {
      id: 'budget-analysis',
      name: 'Budget Impact Analysis',
      description: 'Comprehensive budget analysis and spending prediction',
      requestTypes: ['budget_analysis'],
      steps: [
        {
          agentId: 'budget-guardian',
          agent: this.agents.get('budget-guardian')!,
          required: true
        }
      ]
    });
  }

  /**
   * Process a request through appropriate workflow
   */
  async processRequest(request: AgentRequest, context: AgentContext): Promise<OrchestrationResult> {
    const startTime = Date.now();
    
    try {
      // Determine appropriate workflow
      const workflow = this.selectWorkflow(request);
      if (!workflow) {
        throw new Error(`No workflow found for request type: ${request.type}`);
      }

      console.log(`Processing request ${request.id} through workflow: ${workflow.name}`);

      // Execute workflow steps
      const agentResponses: AgentResponse[] = [];
      let finalDecision: 'approve' | 'deny' | 'escalate' = 'deny';
      let paymentExecuted = false;
      let totalCost = 0;

      for (const step of workflow.steps) {
        // Check if step should be executed
        if (step.condition && !step.condition(context, agentResponses)) {
          console.log(`Skipping step ${step.agentId} due to condition`);
          continue;
        }

        // Execute agent step
        const agentResponse = await step.agent.processRequest(request, context);
        agentResponses.push(agentResponse);

        // Update metrics
        this.updateAgentMetrics(step.agentId, agentResponse);

        // Check if step failed and is required
        if (step.required && agentResponse.decision === 'deny') {
          finalDecision = 'deny';
          break;
        }

        // Update final decision based on agent response
        if (agentResponse.decision === 'approve') {
          finalDecision = 'approve';
        } else if (agentResponse.decision === 'escalate') {
          finalDecision = 'escalate';
        }

        // Track payment execution
        if (agentResponse.paymentExecuted) {
          paymentExecuted = true;
          totalCost += agentResponse.estimatedCost || 0;
        }
      }

      // Calculate overall confidence
      const confidence = this.calculateOverallConfidence(agentResponses);

      // Generate reasoning
      const reasoning = this.generateCombinedReasoning(agentResponses);

      const result: OrchestrationResult = {
        success: finalDecision !== 'deny',
        finalDecision,
        confidence,
        reasoning,
        agentResponses,
        executionTime: Date.now() - startTime,
        paymentExecuted,
        totalCost: totalCost > 0 ? totalCost : undefined
      };

      // Store learning data
      this.storeLearningData(request, context, result);

      return result;

    } catch (error) {
      console.error('Orchestration error:', error);
      return {
        success: false,
        finalDecision: 'escalate',
        confidence: 0,
        reasoning: `Orchestration failed: ${(error as Error).message}`,
        agentResponses: [],
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Select appropriate workflow for request
   */
  private selectWorkflow(request: AgentRequest): Workflow | undefined {
    for (const [workflowId, workflow] of this.workflows) {
      if (workflow.requestTypes.includes(request.type)) {
        return workflow;
      }
    }
    return undefined;
  }

  /**
   * Calculate overall confidence from agent responses
   */
  private calculateOverallConfidence(responses: AgentResponse[]): number {
    if (responses.length === 0) return 0;
    
    const totalConfidence = responses.reduce((sum, response) => sum + response.confidence, 0);
    return Math.round(totalConfidence / responses.length);
  }

  /**
   * Generate combined reasoning from all agent responses
   */
  private generateCombinedReasoning(responses: AgentResponse[]): string {
    if (responses.length === 0) return 'No agent responses available';
    
    // Get the primary decision maker (usually the approval agent or the last successful agent)
    const primaryAgent = responses.find(r => r.decision === 'approve' || r.decision === 'deny') || responses[responses.length - 1];
    
    // Create a clean, summarized reasoning
    const agentNames: Record<string, string> = {
      'request-validation': 'Validation',
      'budget-guardian': 'Budget Analysis',
      'universal-approval': 'Approval Decision',
      'payment-execution': 'Payment Processing',
      'smart-reimbursement': 'Reimbursement Processing'
    };
    
    // Start with primary decision
    let summary = primaryAgent.reasoning;
    
    // Add key insights from other agents if they have important information
    const otherInsights: string[] = [];
    
    responses.forEach(response => {
      if (response.agentId === primaryAgent.agentId) return;
      
      const agentName = agentNames[response.agentId] || response.agentId;
      
      // Only add critical insights, not routine validations
      if (response.decision === 'deny') {
        otherInsights.push(`${agentName}: ${response.reasoning}`);
      } else if (response.riskLevel === 'high' || response.riskLevel === 'critical') {
        otherInsights.push(`${agentName}: High risk detected - ${response.reasoning}`);
      } else if (response.suggestedActions && response.suggestedActions.length > 0) {
        otherInsights.push(`${agentName}: Suggests ${response.suggestedActions[0]}`);
      }
    });
    
    // Combine into readable format
    if (otherInsights.length > 0) {
      summary += `. Additional insights: ${otherInsights.join('; ')}`;
    }
    
    return summary;
  }

  /**
   * Update agent performance metrics
   */
  private updateAgentMetrics(agentId: string, response: AgentResponse): void {
    const current = this.performanceMetrics.get(agentId);
    if (!current) return;

    const updated: AgentPerformance = {
      ...current,
      totalDecisions: current.totalDecisions + 1,
      averageConfidence: this.calculateMovingAverage(
        current.averageConfidence,
        response.confidence,
        current.totalDecisions
      ),
      averageExecutionTime: this.calculateMovingAverage(
        current.averageExecutionTime,
        response.executionTime || 1000,
        current.totalDecisions
      ),
      successRate: this.calculateSuccessRate(agentId, response.decision),
      lastUpdated: new Date()
    };

    this.performanceMetrics.set(agentId, updated);
  }

  /**
   * Calculate moving average for metrics
   */
  private calculateMovingAverage(current: number, newValue: number, count: number): number {
    return Math.round(((current * count) + newValue) / (count + 1));
  }

  /**
   * Calculate success rate for agent
   */
  private calculateSuccessRate(agentId: string, decision: string): number {
    // This would typically query historical data
    // For now, return a mock calculation
    const current = this.performanceMetrics.get(agentId);
    if (!current) return 100;

    const successWeight = decision === 'approve' ? 1 : decision === 'escalate' ? 0.5 : 0;
    const newRate = ((current.successRate * current.totalDecisions) + (successWeight * 100)) / (current.totalDecisions + 1);
    return Math.round(newRate);
  }

  /**
   * Store learning data for future improvements
   */
  private storeLearningData(request: AgentRequest, context: AgentContext, result: OrchestrationResult): void {
    const learningEntry: AgentFeedback = {
      requestId: request.id,
      request: request,
      actualOutcome: result.success ? 'correct' : 'incorrect',
      userSatisfaction: 3 // Default value, would be collected later
    };

    this.learningData.push(learningEntry);

    // Limit learning data size
    if (this.learningData.length > 10000) {
      this.learningData = this.learningData.slice(-5000);
    }
  }

  /**
   * Process batch requests efficiently
   */
  async processBatchRequests(requests: AgentRequest[], context: AgentContext): Promise<{
    results: OrchestrationResult[];
    summary: {
      total: number;
      approved: number;
      denied: number;
      escalated: number;
      totalExecutionTime: number;
      paymentsExecuted: number;
      totalAmount: number;
    };
  }> {
    const results: OrchestrationResult[] = [];
    let totalExecutionTime = 0;
    let paymentsExecuted = 0;
    let totalAmount = 0;

    // Process requests in parallel with concurrency limit
    const concurrencyLimit = 5;
    const chunks = this.chunkArray(requests, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(request => this.processRequest(request, context));
      const chunkResults = await Promise.all(chunkPromises);
      
      results.push(...chunkResults);
      
      // Update counters
      chunkResults.forEach(result => {
        totalExecutionTime += result.executionTime;
        if (result.paymentExecuted) {
          paymentsExecuted++;
          totalAmount += result.totalCost || 0;
        }
      });
    }

    // Calculate summary
    const summary = {
      total: results.length,
      approved: results.filter(r => r.finalDecision === 'approve').length,
      denied: results.filter(r => r.finalDecision === 'deny').length,
      escalated: results.filter(r => r.finalDecision === 'escalate').length,
      totalExecutionTime,
      paymentsExecuted,
      totalAmount
    };

    return { results, summary };
  }

  /**
   * Get agent performance metrics
   */
  getAgentMetrics(): Map<string, AgentPerformance> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Get orchestrator analytics
   */
  getOrchestrationAnalytics(): {
    totalRequests: number;
    averageExecutionTime: number;
    successRate: number;
    agentPerformance: AgentPerformance[];
    workflowStats: { workflowId: string; usage: number }[];
  } {
    const agentPerformance = Array.from(this.performanceMetrics.values());
    
    return {
      totalRequests: this.learningData.length,
      averageExecutionTime: this.calculateAverageExecutionTime(),
      successRate: this.calculateOverallSuccessRate(),
      agentPerformance,
      workflowStats: this.getWorkflowStats()
    };
  }

  /**
   * Learn from feedback and update agent behavior
   */
  async updateLearningModels(feedbacks: AgentFeedback[]): Promise<void> {
    // Update each agent's learning model
    for (const [agentId, agent] of this.agents) {
      const agentFeedbacks = feedbacks.filter(f => f.request.id === agentId);
      if (agentFeedbacks.length > 0 && 'updateLearningModel' in agent) {
        await (agent as any).updateLearningModel(agentFeedbacks);
      }
    }

    // Update orchestrator learning
    this.learningData.push(...feedbacks);
    
    console.log(`Updated learning models with ${feedbacks.length} feedback entries`);
  }

  /**
   * Helper methods
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private calculateAverageExecutionTime(): number {
    const performances = Array.from(this.performanceMetrics.values());
    if (performances.length === 0) return 0;
    
    const totalTime = performances.reduce((sum, p) => sum + p.averageExecutionTime, 0);
    return Math.round(totalTime / performances.length);
  }

  private calculateOverallSuccessRate(): number {
    const performances = Array.from(this.performanceMetrics.values());
    if (performances.length === 0) return 100;
    
    const totalRate = performances.reduce((sum, p) => sum + p.successRate, 0);
    return Math.round(totalRate / performances.length);
  }

  private getWorkflowStats(): { workflowId: string; usage: number }[] {
    // This would typically query historical data
    // For now, return mock data
    return Array.from(this.workflows.keys()).map(workflowId => ({
      workflowId,
      usage: Math.floor(Math.random() * 100)
    }));
  }

  /**
   * Custom workflow management
   */
  addCustomWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  removeWorkflow(workflowId: string): void {
    this.workflows.delete(workflowId);
  }

  getWorkflows(): Map<string, Workflow> {
    return new Map(this.workflows);
  }
}

// Singleton instance
export const agentOrchestrator = new AgentOrchestrator(); 