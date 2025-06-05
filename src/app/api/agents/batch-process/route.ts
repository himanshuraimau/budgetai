import { NextRequest, NextResponse } from 'next/server';
import { agentOrchestrator } from '../../../../lib/agents/AgentOrchestrator';
import { crossCompanyLearning } from '../../../../lib/agents/CrossCompanyLearning';
import { AgentRequest, AgentContext } from '../../../../lib/agents/types';
import { auth } from '@/auth';
import { Company } from '../../../../db/models/Company';
import { User } from '../../../../db/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { requests, batchOptions = {} } = body;

    // Validate request data
    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: 'Invalid requests array' },
        { status: 400 }
      );
    }

    if (requests.length > 100) {
      return NextResponse.json(
        { error: 'Batch size too large. Maximum 100 requests per batch.' },
        { status: 400 }
      );
    }

    // Get user and company context
    const user = await User.findById(session.user.id);
    const company = await Company.findById(user?.companyId);

    if (!user || !company) {
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      );
    }

    // Create agent context
    const agentContext: AgentContext = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        paymanWalletId: user.paymanWalletId
      },
      company: {
        id: company._id.toString(),
        name: company.name,
        industry: company.industry,
        size: company.size,
        paymanWalletId: company.paymanWalletId,
        policies: company.policies || []
      },
      request: null as any // Will be set per request
    };

    // Convert requests to AgentRequest format
    const agentRequests: AgentRequest[] = requests.map((req, index) => ({
      id: req.id || `batch_${Date.now()}_${index}`,
      companyId: company._id.toString(),
      requestId: req.requestId || req.id,
      type: req.type,
      data: req.data,
      priority: req.priority || batchOptions.defaultPriority || 'medium',
      timestamp: new Date(),
      metadata: {
        userId: user._id.toString(),
        batchId: `batch_${Date.now()}`,
        batchIndex: index,
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    }));

    // Process batch through orchestrator
    const batchResult = await agentOrchestrator.processBatchRequests(agentRequests, agentContext);

    // Analyze batch results for insights
    const batchAnalysis = {
      approvalRate: (batchResult.summary.approved / batchResult.summary.total) * 100,
      averageExecutionTime: batchResult.summary.totalExecutionTime / batchResult.summary.total,
      riskDistribution: {
        low: batchResult.results.filter(r => r.agentResponses.some(ar => ar.riskLevel === 'low')).length,
        medium: batchResult.results.filter(r => r.agentResponses.some(ar => ar.riskLevel === 'medium')).length,
        high: batchResult.results.filter(r => r.agentResponses.some(ar => ar.riskLevel === 'high')).length
      },
      categories: analyzeBatchCategories(agentRequests),
      recommendations: generateBatchRecommendations(batchResult)
    };

    // Get spending recommendations for the company
    const spendingRecommendations = crossCompanyLearning.getSpendingRecommendations(
      company._id.toString(),
      agentContext
    );

    return NextResponse.json({
      success: true,
      batchId: `batch_${Date.now()}`,
      summary: batchResult.summary,
      results: batchResult.results,
      analysis: batchAnalysis,
      spendingRecommendations,
      processingTime: batchResult.summary.totalExecutionTime,
      agentMetrics: Object.fromEntries(agentOrchestrator.getAgentMetrics())
    });

  } catch (error) {
    console.error('Batch processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process batch requests',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper functions (attached to the route handler)
function analyzeBatchCategories(requests: AgentRequest[]) {
  const categories = new Map<string, { count: number; totalAmount: number }>();
  
  requests.forEach(req => {
    const category = req.data.category || 'unknown';
    const amount = req.data.amount || 0;
    
    if (!categories.has(category)) {
      categories.set(category, { count: 0, totalAmount: 0 });
    }
    
    const current = categories.get(category)!;
    categories.set(category, {
      count: current.count + 1,
      totalAmount: current.totalAmount + amount
    });
  });
  
  return Object.fromEntries(categories);
}

function generateBatchRecommendations(batchResult: any): string[] {
  const recommendations: string[] = [];
  const { summary } = batchResult;
  
  // Approval rate analysis
  const approvalRate = (summary.approved / summary.total) * 100;
  if (approvalRate < 50) {
    recommendations.push('Low approval rate detected. Consider reviewing request criteria and policies.');
  }
  
  // Execution time analysis
  const avgTime = summary.totalExecutionTime / summary.total;
  if (avgTime > 5000) {
    recommendations.push('High processing times detected. Consider optimizing workflows or system performance.');
  }
  
  // Payment execution analysis
  if (summary.paymentsExecuted > 0) {
    recommendations.push(`${summary.paymentsExecuted} payments were automatically executed, totaling $${summary.totalAmount}.`);
  }
  
  // Escalation analysis
  if (summary.escalated > summary.total * 0.3) {
    recommendations.push('High escalation rate. Consider adjusting agent thresholds or adding more automated rules.');
  }
  
  return recommendations;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    
    if (batchId) {
      // Return specific batch status/results
      // This would typically query a database for batch results
      return NextResponse.json({
        success: true,
        batchId,
        status: 'completed',
        message: 'Batch processing results would be retrieved from database'
      });
    }

    // Return batch processing capabilities and limits
    return NextResponse.json({
      success: true,
      capabilities: {
        maxBatchSize: 100,
        supportedTypes: ['approval', 'payment', 'reimbursement', 'budget_analysis'],
        estimatedProcessingTime: '2-5 seconds per request',
        parallelProcessing: true,
        concurrencyLimit: 5
      },
      agentMetrics: Object.fromEntries(agentOrchestrator.getAgentMetrics())
    });

  } catch (error) {
    console.error('Error fetching batch info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch processing information' },
      { status: 500 }
    );
  }
} 