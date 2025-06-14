import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RequestDetails {
  amount: number;
  description: string;
  category: string;
  departmentName?: string;
  employeeName?: string;
  finalDecision: 'approved' | 'denied' | 'escalated';
}

export async function generateDecisionReason(requestDetails: RequestDetails): Promise<string> {
  try {
    const { amount, description, category, departmentName, employeeName, finalDecision } = requestDetails;

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback reason');
      return generateFallbackReason(requestDetails);
    }

    const prompt = `You are an AI assistant that generates professional, clear decision reasons for business purchase requests. 

Request Details:
- Amount: $${amount}
- Description: ${description}
- Category: ${category}
- Department: ${departmentName || 'Unknown'}
- Employee: ${employeeName || 'Unknown'}
- Decision: ${finalDecision}

Generate a professional, concise decision reason (1-2 sentences) that explains why this request was ${finalDecision}. The reason should:
- Be written in professional business language
- Focus on business value and justification
- Be specific to this request
- Sound like it came from a finance manager or approval system
- Avoid technical jargon
- Be positive and supportive for approved requests
- Be constructive and helpful for denied requests

Examples of good decision reasons:
- "Approved: This software license will enhance development productivity and aligns with our technology modernization goals."
- "Approved: Essential office supplies within budget guidelines to support daily operations."
- "Denied: Request exceeds monthly department budget allocation. Please resubmit next month or request budget adjustment."

Generate the decision reason:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedReason = response.choices[0]?.message?.content?.trim();
    
    if (!generatedReason) {
      return generateFallbackReason(requestDetails);
    }

    return generatedReason;

  } catch (error) {
    console.error('Error generating decision reason with OpenAI:', error);
    return generateFallbackReason(requestDetails);
  }
}

function generateFallbackReason(requestDetails: RequestDetails): string {
  const { amount, description, category, departmentName, finalDecision } = requestDetails;

  if (finalDecision === 'approved') {
    // Create more specific approval reasons based on category and amount
    const categoryInsight = getCategoryInsights(category, amount);
    
    if (category.toLowerCase() === 'software') {
      return `Approved: ${description} - This ${categoryInsight} will enhance ${departmentName || 'team'} productivity and efficiency.`;
    } else if (category.toLowerCase() === 'office supplies') {
      return `Approved: Essential ${categoryInsight} to support daily operations and maintain workflow efficiency.`;
    } else if (category.toLowerCase() === 'travel') {
      return `Approved: ${categoryInsight} necessary for business objectives and client engagement.`;
    } else if (category.toLowerCase() === 'equipment') {
      return `Approved: ${categoryInsight} required to maintain operational capabilities and productivity.`;
    } else if (category.toLowerCase() === 'training') {
      return `Approved: ${categoryInsight} investment in employee development aligns with our growth objectives.`;
    } else if (category.toLowerCase() === 'marketing') {
      return `Approved: ${categoryInsight} to support brand visibility and business growth initiatives.`;
    } else {
      // Generic approval with business context
      if (amount < 100) {
        return `Approved: Low-cost ${category.toLowerCase()} expense approved for operational efficiency.`;
      } else if (amount < 1000) {
        return `Approved: ${category} expense justified for business operations and within budget guidelines.`;
      } else {
        return `Approved: Significant ${category.toLowerCase()} investment approved based on business value and budget availability.`;
      }
    }
  } else if (finalDecision === 'denied') {
    if (amount > 5000) {
      return `Denied: Request amount of $${amount.toLocaleString()} exceeds approval thresholds. Please provide additional justification or seek higher-level approval.`;
    } else if (category.toLowerCase() === 'software' && amount > 1000) {
      return `Denied: Software expense requires additional approval due to licensing and security review requirements.`;
    } else {
      return `Denied: Request does not meet current approval criteria. Please review business justification and resubmit with additional details.`;
    }
  } else {
    return `Escalated: Request for ${category.toLowerCase()} ($${amount.toLocaleString()}) requires additional review and approval from department management.`;
  }
}

// Helper function to extract category-specific insights
export function getCategoryInsights(category: string, amount: number): string {
  const insights: Record<string, (amount: number) => string> = {
    'Software': (amt) => {
      if (amt < 100) return 'productivity tool';
      if (amt < 500) return 'professional software license';
      if (amt < 2000) return 'enterprise software solution';
      return 'comprehensive software platform';
    },
    'Office Supplies': (amt) => {
      if (amt < 50) return 'basic office materials';
      if (amt < 200) return 'routine office supplies';
      if (amt < 500) return 'bulk office supply order';
      return 'comprehensive office equipment';
    },
    'Travel': (amt) => {
      if (amt < 500) return 'local business travel';
      if (amt < 1500) return 'regional business trip';
      if (amt < 3000) return 'extended business travel';
      return 'comprehensive business travel program';
    },
    'Equipment': (amt) => {
      if (amt < 500) return 'standard work equipment';
      if (amt < 2000) return 'professional equipment';
      if (amt < 5000) return 'specialized equipment';
      return 'major equipment investment';
    },
    'Training': (amt) => {
      if (amt < 200) return 'online training course';
      if (amt < 1000) return 'professional development program';
      if (amt < 3000) return 'specialized training certification';
      return 'comprehensive training initiative';
    },
    'Marketing': (amt) => {
      if (amt < 300) return 'promotional materials';
      if (amt < 1000) return 'marketing campaign';
      if (amt < 5000) return 'comprehensive marketing initiative';
      return 'strategic marketing investment';
    },
    'Meals': (amt) => {
      if (amt < 50) return 'team meal';
      if (amt < 200) return 'client entertainment';
      return 'business dining event';
    },
    'Subscriptions': (amt) => {
      if (amt < 100) return 'monthly service subscription';
      if (amt < 500) return 'annual software subscription';
      return 'enterprise subscription package';
    }
  };

  const insightFn = insights[category];
  return insightFn ? insightFn(amount) : amount < 500 ? 'routine business expense' : 'significant business investment';
}
