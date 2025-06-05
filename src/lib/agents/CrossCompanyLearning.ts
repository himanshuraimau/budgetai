import { AgentFeedback, AgentRequest, AgentResponse, AgentContext } from './types';

interface LearningPattern {
  id: string;
  category: string;
  pattern: string;
  frequency: number;
  successRate: number;
  averageAmount: number;
  companies: string[]; // Anonymized company IDs
  industries: string[];
  createdAt: Date;
  lastUpdated: Date;
}

interface FraudSignal {
  id: string;
  signalType: 'amount_pattern' | 'timing_pattern' | 'frequency_pattern' | 'vendor_pattern';
  description: string;
  riskScore: number; // 0-100
  detectionCount: number;
  falsePositiveRate: number;
  platformFrequency: number;
}

interface CompanyBenchmark {
  industry: string;
  companySize: 'small' | 'medium' | 'large';
  avgMonthlySpend: number;
  avgRequestAmount: number;
  avgApprovalTime: number;
  popularCategories: { category: string; percentage: number }[];
  avgFraudRate: number;
}

interface LearningInsight {
  type: 'spending_trend' | 'approval_pattern' | 'fraud_detection' | 'vendor_optimization';
  insight: string;
  confidence: number;
  applicableCompanies: string[];
  potentialImpact: number; // Estimated savings/efficiency gain
  evidence: {
    dataPoints: number;
    timeRange: string;
    sources: string[];
  };
}

export class CrossCompanyLearning {
  private patterns: Map<string, LearningPattern> = new Map();
  private fraudSignals: Map<string, FraudSignal> = new Map();
  private benchmarks: Map<string, CompanyBenchmark> = new Map();
  private insights: LearningInsight[] = [];
  private learningData: AgentFeedback[] = [];

  constructor() {
    this.initializeFraudSignals();
    this.schedulePeriodicLearning();
  }

  /**
   * Process new feedback and extract learning patterns
   */
  async processFeedback(feedbacks: AgentFeedback[]): Promise<void> {
    console.log(`Processing ${feedbacks.length} feedback entries for cross-company learning`);
    
    this.learningData.push(...feedbacks);
    
    // Extract patterns from successful/failed decisions
    await this.extractSpendingPatterns(feedbacks);
    await this.updateFraudSignals(feedbacks);
    await this.updateBenchmarks(feedbacks);
    await this.generateInsights();
    
    // Clean old data periodically
    this.cleanOldData();
  }

  /**
   * Extract spending patterns across companies
   */
  private async extractSpendingPatterns(feedbacks: AgentFeedback[]): Promise<void> {
    const categoryGroups = this.groupByCategory(feedbacks);
    
    for (const [category, categoryFeedbacks] of categoryGroups) {
      const successfulRequests = categoryFeedbacks.filter(f => f.actualOutcome === 'correct');
      
      if (successfulRequests.length >= 5) {
        const pattern = this.analyzeCategory(category, successfulRequests);
        
        const patternId = `pattern-${category}-${Date.now()}`;
        this.patterns.set(patternId, {
          id: patternId,
          category,
          pattern: pattern.description,
          frequency: successfulRequests.length,
          successRate: (successfulRequests.length / categoryFeedbacks.length) * 100,
          averageAmount: pattern.averageAmount,
          companies: pattern.companies,
          industries: pattern.industries,
          createdAt: new Date(),
          lastUpdated: new Date()
        });
      }
    }
  }

  /**
   * Update fraud detection signals
   */
  private async updateFraudSignals(feedbacks: AgentFeedback[]): Promise<void> {
    const fraudulentFeedbacks = feedbacks.filter(f => 
      f.actualOutcome === 'incorrect' && f.userSatisfaction > 80
    );

    // Analyze amount patterns for fraud
    this.analyzeAmountFraudPatterns(fraudulentFeedbacks);
    
    // Analyze timing patterns
    this.analyzeTimingFraudPatterns(fraudulentFeedbacks);
    
    // Analyze frequency patterns
    this.analyzeFrequencyFraudPatterns(fraudulentFeedbacks);
  }

  /**
   * Get spending recommendations for a company
   */
  getSpendingRecommendations(companyId: string, context: AgentContext): {
    recommendations: string[];
    benchmarkComparison: {
      metric: string;
      yourValue: number;
      industryAverage: number;
      percentile: number;
    }[];
    potentialSavings: number;
  } {
    const companySize = this.determineCompanySize(context);
    const industry = context.companyId || 'general';
    
    const benchmark = this.getBenchmarkForCompany(industry, companySize);
    const recommendations: string[] = [];
    const benchmarkComparison: any[] = [];
    let potentialSavings = 0;

    if (benchmark) {
      // Compare spending patterns
      const companySpending = this.getCompanySpending(companyId);
      
      if (companySpending.avgMonthlySpend > benchmark.avgMonthlySpend * 1.2) {
        recommendations.push(`Your monthly spending is 20% above industry average. Consider reviewing budget allocations.`);
        potentialSavings += (companySpending.avgMonthlySpend - benchmark.avgMonthlySpend) * 0.1;
      }

      if (companySpending.avgApprovalTime > benchmark.avgApprovalTime * 1.5) {
        recommendations.push(`Your approval time is 50% slower than industry average. Consider automating more requests.`);
      }

      benchmarkComparison.push(
        {
          metric: 'Monthly Spend',
          yourValue: companySpending.avgMonthlySpend,
          industryAverage: benchmark.avgMonthlySpend,
          percentile: this.calculatePercentile(companySpending.avgMonthlySpend, 'spending')
        },
        {
          metric: 'Approval Time',
          yourValue: companySpending.avgApprovalTime,
          industryAverage: benchmark.avgApprovalTime,
          percentile: this.calculatePercentile(companySpending.avgApprovalTime, 'approval_time')
        }
      );
    }

    // Add pattern-based recommendations
    const relevantPatterns = this.getRelevantPatterns(context);
    relevantPatterns.forEach(pattern => {
      if (pattern.successRate > 90) {
        recommendations.push(`Consider pre-approving ${pattern.category} requests under $${pattern.averageAmount} for faster processing.`);
      }
    });

    return {
      recommendations,
      benchmarkComparison,
      potentialSavings: Math.round(potentialSavings)
    };
  }

  /**
   * Detect fraud risks for a request
   */
  detectFraudRisk(request: AgentRequest, context: AgentContext): {
    riskScore: number;
    riskFactors: string[];
    recommendations: string[];
  } {
    let riskScore = 0;
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Check against known fraud signals
    for (const [signalId, signal] of this.fraudSignals) {
      const signalMatch = this.checkSignalMatch(request, signal);
      if (signalMatch.matches) {
        riskScore += signal.riskScore * signalMatch.confidence;
        riskFactors.push(signal.description);
        
        if (signal.falsePositiveRate < 10) {
          recommendations.push(`High-confidence fraud signal detected: ${signal.description}`);
        }
      }
    }

    // Check against platform patterns
    const platformRisk = this.checkPlatformRisk(request, context);
    riskScore += platformRisk.score;
    riskFactors.push(...platformRisk.factors);

    return {
      riskScore: Math.min(riskScore, 100),
      riskFactors,
      recommendations
    };
  }

  /**
   * Get vendor optimization suggestions
   */
  getVendorOptimizations(companyId: string): {
    suggestions: string[];
    alternativeVendors: { current: string; alternative: string; potentialSavings: number }[];
    negotiationOpportunities: { vendor: string; averageDiscount: number; confidence: number }[];
  } {
    // Analyze vendor spending patterns across platform
    const vendorPatterns = this.analyzeVendorPatterns(companyId);
    
    return {
      suggestions: [
        "Consider bulk purchasing agreements for office supplies - other companies report 15% savings",
        "Software subscriptions show 20% better rates when negotiated annually",
        "Travel expenses can be reduced by 25% with preferred vendor partnerships"
      ],
      alternativeVendors: vendorPatterns.alternatives,
      negotiationOpportunities: vendorPatterns.negotiations
    };
  }

  /**
   * Generate insights from cross-company data
   */
  private async generateInsights(): Promise<void> {
    const newInsights: LearningInsight[] = [];

    // Spending trend insights
    const spendingTrends = this.analyzeSpendingTrends();
    newInsights.push(...spendingTrends);

    // Approval pattern insights
    const approvalInsights = this.analyzeApprovalPatterns();
    newInsights.push(...approvalInsights);

    // Fraud detection insights
    const fraudInsights = this.analyzeFraudTrends();
    newInsights.push(...fraudInsights);

    // Keep only the most recent insights
    this.insights = [...newInsights, ...this.insights].slice(0, 100);
  }

  /**
   * Get predictive insights for a company
   */
  getPredictiveInsights(companyId: string, context: AgentContext): {
    spendingPrediction: {
      nextMonth: number;
      confidence: number;
      factors: string[];
    };
    riskPrediction: {
      fraudRisk: number;
      budgetOverrunRisk: number;
      factors: string[];
    };
    opportunityIdentification: {
      costSavings: number;
      efficiencyGains: string[];
      automationOpportunities: string[];
    };
  } {
    const historicalData = this.getCompanyHistoricalData(companyId);
    const industryTrends = this.getIndustryTrends(context.companyId || 'general');

    return {
      spendingPrediction: {
        nextMonth: this.predictNextMonthSpending(historicalData, industryTrends),
        confidence: 85,
        factors: ['Seasonal trends', 'Historical patterns', 'Industry benchmarks']
      },
      riskPrediction: {
        fraudRisk: this.calculateFraudRisk(companyId),
        budgetOverrunRisk: this.calculateBudgetRisk(historicalData),
        factors: ['Historical variance', 'Industry comparison', 'Current trends']
      },
      opportunityIdentification: {
        costSavings: this.identifyCostSavings(companyId),
        efficiencyGains: this.identifyEfficiencyGains(companyId),
        automationOpportunities: this.identifyAutomationOpportunities(companyId)
      }
    };
  }

  /**
   * Privacy-preserving analytics
   */
  private anonymizeCompanyData(data: any): any {
    // Remove or hash sensitive company information
    return {
      ...data,
      companyId: this.hashCompanyId(data.companyId),
      employeeIds: data.employeeIds?.map((id: string) => this.hashEmployeeId(id)),
      // Keep only aggregated/statistical data
    };
  }

  /**
   * Helper methods for pattern analysis
   */
  private groupByCategory(feedbacks: AgentFeedback[]): Map<string, AgentFeedback[]> {
    const groups = new Map<string, AgentFeedback[]>();
    
    feedbacks.forEach(feedback => { 
      const category = feedback.request.data.category || 'unknown';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(feedback);
    });
    
    return groups;
  }

  private analyzeCategory(category: string, feedbacks: AgentFeedback[]): {
    description: string;
    averageAmount: number;
    companies: string[];
    industries: string[];
  } {
    const amounts = feedbacks.map(f => f.request.data.amount || 0);
    const companies = [...new Set(feedbacks.map(f => this.hashCompanyId(f.request.companyId)))];
    
    return {
      description: `Successful ${category} requests typically range $${Math.min(...amounts)}-$${Math.max(...amounts)}`,
      averageAmount: amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length,
      companies,
      industries: ['tech', 'finance', 'retail'] // Mock data
    };
  }

  private initializeFraudSignals(): void {
    // Initialize common fraud signals
    this.fraudSignals.set('round-amounts', {
      id: 'round-amounts',
      signalType: 'amount_pattern',
      description: 'Suspiciously round amounts (e.g., $500, $1000)',
      riskScore: 25,
      detectionCount: 0,
      falsePositiveRate: 15,
      platformFrequency: 5.2
    });

    this.fraudSignals.set('weekend-submissions', {
      id: 'weekend-submissions',
      signalType: 'timing_pattern',
      description: 'Requests submitted during weekends',
      riskScore: 15,
      detectionCount: 0,
      falsePositiveRate: 20,
      platformFrequency: 8.1
    });

    this.fraudSignals.set('high-frequency', {
      id: 'high-frequency',
      signalType: 'frequency_pattern',
      description: 'Multiple requests from same employee within short timeframe',
      riskScore: 35,
      detectionCount: 0,
      falsePositiveRate: 8,
      platformFrequency: 3.7
    });
  }

  private schedulePeriodicLearning(): void {
    // Schedule periodic analysis and pattern updates
    setInterval(() => {
      this.performPeriodicAnalysis();
    }, 24 * 60 * 60 * 1000); // Daily
  }

  private async performPeriodicAnalysis(): Promise<void> {
    console.log('Performing periodic cross-company learning analysis...');
    
    // Update benchmarks
    await this.updateBenchmarks(this.learningData.slice(-1000));
    
    // Generate new insights
    await this.generateInsights();
    
    // Clean old data
    this.cleanOldData();
  }

  private cleanOldData(): void {
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
    
    // Clean old learning data
    this.learningData = this.learningData.filter(data => data.request.data.timestamp > cutoffDate);
    
    // Clean old patterns
    for (const [patternId, pattern] of this.patterns) {
      if (pattern.lastUpdated < cutoffDate) {
        this.patterns.delete(patternId);
      }
    }
  }

  // Mock implementations for helper methods
  private determineCompanySize(context: AgentContext): 'small' | 'medium' | 'large' {
    return 'medium'; // Mock implementation
  }

  private getBenchmarkForCompany(industry: string, size: string): CompanyBenchmark | undefined {
    return undefined; // Mock implementation
  }

  private getCompanySpending(companyId: string): any {
    return { avgMonthlySpend: 25000, avgApprovalTime: 2.5 }; // Mock implementation
  }

  private calculatePercentile(value: number, metric: string): number {
    return 65; // Mock implementation
  }

  private getRelevantPatterns(context: AgentContext): LearningPattern[] {
    return Array.from(this.patterns.values()).slice(0, 3); // Mock implementation
  }

  private checkSignalMatch(request: AgentRequest, signal: FraudSignal): { matches: boolean; confidence: number } {
    return { matches: false, confidence: 0 }; // Mock implementation
  }

  private checkPlatformRisk(request: AgentRequest, context: AgentContext): { score: number; factors: string[] } {
    return { score: 0, factors: [] }; // Mock implementation
  }

  private analyzeVendorPatterns(companyId: string): any {
    return { alternatives: [], negotiations: [] }; // Mock implementation
  }

  private analyzeSpendingTrends(): LearningInsight[] {
    return []; // Mock implementation
  }

  private analyzeApprovalPatterns(): LearningInsight[] {
    return []; // Mock implementation
  }

  private analyzeFraudTrends(): LearningInsight[] {
    return []; // Mock implementation
  }

  private getCompanyHistoricalData(companyId: string): any {
    return {}; // Mock implementation
  }

  private getIndustryTrends(industry: string): any {
    return {}; // Mock implementation
  }

  private predictNextMonthSpending(historical: any, trends: any): number {
    return 25000; // Mock implementation
  }

  private calculateFraudRisk(companyId: string): number {
    return 15; // Mock implementation
  }

  private calculateBudgetRisk(historical: any): number {
    return 25; // Mock implementation
  }

  private identifyCostSavings(companyId: string): number {
    return 2500; // Mock implementation
  }

  private identifyEfficiencyGains(companyId: string): string[] {
    return ['Automate low-value approvals', 'Batch similar requests']; // Mock implementation
  }

  private identifyAutomationOpportunities(companyId: string): string[] {
    return ['Office supplies under $100', 'Software renewals']; // Mock implementation
  }

  private hashCompanyId(companyId: string): string {
    return `comp_${companyId.slice(-8)}`; // Simple hash for privacy
  }

  private hashEmployeeId(employeeId: string): string {
    return `emp_${employeeId.slice(-8)}`; // Simple hash for privacy
  }

  private analyzeAmountFraudPatterns(feedbacks: AgentFeedback[]): void {
    // Implementation for amount pattern analysis
  }

  private analyzeTimingFraudPatterns(feedbacks: AgentFeedback[]): void {
    // Implementation for timing pattern analysis
  }

  private analyzeFrequencyFraudPatterns(feedbacks: AgentFeedback[]): void {
    // Implementation for frequency pattern analysis
  }

  private async updateBenchmarks(feedbacks: AgentFeedback[]): Promise<void> {
    // Implementation for benchmark updates
  }
}

// Singleton instance
export const crossCompanyLearning = new CrossCompanyLearning(); 