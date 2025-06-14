/**
 * Utility functions for formatting AI agent responses and decisions
 */

export function formatDecisionReason(reason: string): string {
  if (!reason || reason.trim().length === 0) {
    return 'No decision reason provided';
  }

  // If it's already a clean format, return as is
  if (reason.length < 200 && !reason.includes(';') && !reason.includes(' | ')) {
    return reason;
  }

  // Handle old concatenated format - extract the most important part
  const parts = reason.split(/[;|]/).map(part => part.trim());
  
  // Look for the primary decision maker (approval/denial)
  const approvalPart = parts.find(part => 
    part.toLowerCase().includes('approve') || 
    part.toLowerCase().includes('deny') ||
    part.toLowerCase().includes('escalate')
  );

  if (approvalPart) {
    // Clean up agent prefixes
    const cleaned = approvalPart
      .replace(/^(request-validation|budget-guardian|universal-approval|payment-execution|smart-reimbursement):\s*/i, '')
      .replace(/^\w+-\w+:\s*/, ''); // Remove any other agent prefixes
    
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Fallback: take the first meaningful part
  const firstMeaningfulPart = parts.find(part => part.length > 10) || parts[0];
  return firstMeaningfulPart?.replace(/^\w+-\w+:\s*/, '') || reason;
}

export function getAgentDisplayName(agentId: string): string {
  const names: Record<string, string> = {
    'request-validation': 'Validation Agent',
    'budget-guardian': 'Budget Guardian',
    'universal-approval': 'Approval Agent',
    'payment-execution': 'Payment Processor',
    'smart-reimbursement': 'Reimbursement Agent'
  };
  
  return names[agentId] || agentId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function formatAgentResponse(agentId: string, reasoning: string, confidence: number): string {
  const agentName = getAgentDisplayName(agentId);
  return `${agentName} (${confidence}% confident): ${reasoning}`;
}
