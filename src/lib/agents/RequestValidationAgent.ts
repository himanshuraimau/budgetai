import { BaseAgent, AgentRequest, AgentResponse, AgentContext, AgentMetrics, AgentCapabilities, AgentFeedback } from './types';

export class RequestValidationAgent extends BaseAgent {
  readonly id = 'request-validation';
  readonly name = 'Request Validation Agent';
  readonly capabilities: AgentCapabilities = {
    canApprovePayments: false,
    canExecutePayments: false,
    canAnalyzeBudgets: false,
    canDetectFraud: true,
    canPredictsSpending: false,
    maxDecisionAmount: Infinity,
    supportedCategories: ['*']
  };

  async processRequest(request: AgentRequest, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Validate request legitimacy
      const legitimacyCheck = this.validateRequestLegitimacy(request);
      if (!legitimacyCheck.isValid) {
        return {
          requestId: request.id,
          agentId: this.id,
          decision: 'deny',
          confidence: 95,
          reasoning: legitimacyCheck.reason,
          riskLevel: 'high',
          executionTime: Date.now() - startTime
        };
      }

      // Validate category matching
      const categoryCheck = this.validateCategoryMatching(request);
      if (!categoryCheck.isValid) {
        return {
          requestId: request.id,
          agentId: this.id,
          decision: 'deny',
          confidence: 90,
          reasoning: categoryCheck.reason,
          suggestedActions: [`Recategorize to: ${categoryCheck.suggestedCategory}`],
          riskLevel: 'medium',
          executionTime: Date.now() - startTime
        };
      }

      // Validate business purpose
      const businessCheck = this.validateBusinessPurpose(request, context);
      if (!businessCheck.isValid) {
        return {
          requestId: request.id,
          agentId: this.id,
          decision: 'deny',
          confidence: 85,
          reasoning: businessCheck.reason,
          suggestedActions: ['Provide better business justification', 'Clarify work relevance'],
          riskLevel: 'medium',
          executionTime: Date.now() - startTime
        };
      }

      // All validations passed
      return {
        requestId: request.id,
        agentId: this.id,
        decision: 'approve',
        confidence: 95,
        reasoning: 'Request validated successfully - legitimate business expense with proper categorization',
        riskLevel: 'low',
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('RequestValidationAgent error:', error);
      return {
        requestId: request.id,
        agentId: this.id,
        decision: 'escalate',
        confidence: 0,
        reasoning: `Validation failed: ${(error as Error).message}`,
        riskLevel: 'high',
        executionTime: Date.now() - startTime
      };
    }
  }

  private validateRequestLegitimacy(request: AgentRequest): { isValid: boolean; reason: string } {
    const description = request.data.description?.toLowerCase() || '';
    const amount = request.data.amount || 0;

    // Personal expenses that are clearly not business-related
    const personalExpenseKeywords = [
      'hungry', 'food for me', 'personal food', 'my lunch', 'dinner for myself',
      'gas for my car', 'personal travel', 'my vacation', 'birthday party',
      'personal shopping', 'clothes for me', 'my haircut', 'medical bills',
      'rent', 'mortgage', 'personal loan', 'credit card payment',
      'i need money', 'need cash', 'broke', 'personal use', 'for myself'
    ];

    for (const keyword of personalExpenseKeywords) {
      if (description.includes(keyword)) {
        return {
          isValid: false,
          reason: `Request appears to be for personal expenses ("${keyword}"). Business expenses must be for company operations, not personal needs.`
        };
      }
    }

    // Vague or suspicious requests
    const vagueKeywords = [
      'need money', 'just because', 'misc', 'stuff', 'things', 'whatever',
      'urgent cash', 'emergency money', 'quick payment'
    ];

    for (const keyword of vagueKeywords) {
      if (description.includes(keyword)) {
        return {
          isValid: false,
          reason: `Request is too vague ("${keyword}"). Please provide specific business justification and clear description of what will be purchased.`
        };
      }
    }

    // Unreasonably high amounts without proper justification
    if (amount > 1000 && description.length < 20) {
      return {
        isValid: false,
        reason: `High amount ($${amount}) requires detailed justification. Please provide comprehensive description of business need and intended use.`
      };
    }

    return { isValid: true, reason: '' };
  }

  private validateCategoryMatching(request: AgentRequest): { 
    isValid: boolean; 
    reason: string; 
    suggestedCategory?: string 
  } {
    const description = request.data.description?.toLowerCase() || '';
    const category = request.data.category || '';

    // Define category keywords
    const categoryKeywords = {
      'Software': ['software', 'license', 'subscription', 'saas', 'app', 'tool', 'platform', 'api', 'cloud'],
      'Office Supplies': ['paper', 'pen', 'stapler', 'folder', 'notebook', 'supplies', 'stationery'],
      'Equipment': ['laptop', 'computer', 'monitor', 'keyboard', 'mouse', 'hardware', 'device'],
      'Travel': ['flight', 'hotel', 'travel', 'conference', 'transportation', 'uber', 'taxi'],
      'Marketing': ['advertising', 'ads', 'marketing', 'promotion', 'branding', 'campaign'],
      'Training': ['course', 'training', 'education', 'certification', 'workshop', 'seminar'],
      'Meals': ['lunch', 'dinner', 'catering', 'team meal', 'client dinner', 'business lunch']
    };

    // Check if description matches category
    const matchingCategories: string[] = [];
    
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        matchingCategories.push(cat);
      }
    }

    // If we found matching categories but current category isn't one of them
    if (matchingCategories.length > 0 && !matchingCategories.includes(category)) {
      return {
        isValid: false,
        reason: `Category mismatch: "${description}" appears to be ${matchingCategories.join(' or ')} but categorized as ${category}`,
        suggestedCategory: matchingCategories[0]
      };
    }

    // Special check for food-related requests
    if (description.includes('food') || description.includes('hungry') || description.includes('eat')) {
      if (category === 'Office Supplies' || category === 'Software' || category === 'Equipment') {
        return {
          isValid: false,
          reason: `Food-related request incorrectly categorized as ${category}. Food should be categorized as "Meals" and must be for business purposes (team meetings, client entertainment, etc.)`,
          suggestedCategory: 'Meals'
        };
      }
    }

    return { isValid: true, reason: '' };
  }

  private validateBusinessPurpose(request: AgentRequest, context: AgentContext): { 
    isValid: boolean; 
    reason: string 
  } {
    const description = request.data.description?.toLowerCase() || '';
    
    // Must show clear business benefit
    const businessKeywords = [
      'productivity', 'efficiency', 'team', 'client', 'project', 'development',
      'company', 'business', 'work', 'office', 'meeting', 'collaboration',
      'streamline', 'enhance', 'improve', 'support', 'operations'
    ];

    const hasBusinessPurpose = businessKeywords.some(keyword => description.includes(keyword));

    // For certain categories, business purpose is critical
    const criticalCategories = ['Software', 'Equipment', 'Training'];
    
    if (criticalCategories.includes(request.data.category) && !hasBusinessPurpose) {
      return {
        isValid: false,
        reason: `${request.data.category} purchases require clear business justification. Please explain how this will benefit company operations, productivity, or goals.`
      };
    }

    // Check for team vs personal language
    const personalLanguage = ['i need', 'i want', 'for me', 'my personal'];
    const teamLanguage = ['we need', 'team needs', 'for the team', 'company needs'];

    const hasPersonalLanguage = personalLanguage.some(phrase => description.includes(phrase));
    const hasTeamLanguage = teamLanguage.some(phrase => description.includes(phrase));

    if (hasPersonalLanguage && !hasTeamLanguage) {
      return {
        isValid: false,
        reason: `Request uses personal language ("${personalLanguage.find(p => description.includes(p))}"). Business expenses should focus on company/team benefits, not personal needs.`
      };
    }

    return { isValid: true, reason: '' };
  }

  async getMetrics(): Promise<AgentMetrics> {
    return {
      totalRequests: 0,
      approvedRequests: 0,
      deniedRequests: 0,
      escalatedRequests: 0,
      averageConfidence: 0,
      averageProcessingTime: 0,
      successRate: 0
    };
  }

  async updateLearning(feedback: AgentFeedback): Promise<void> {
    // Implement learning from validation feedback
    console.log(`RequestValidationAgent learning from feedback: ${feedback.outcome}`);
  }
} 