import { NextRequest, NextResponse } from 'next/server';
import { agentOrchestrator } from '../../../../lib/agents/AgentOrchestrator';
import { crossCompanyLearning } from '../../../../lib/agents/CrossCompanyLearning';
import { AgentRequest, AgentContext } from '../../../../lib/agents/types';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import { Company } from '../../../../db/models/Company';
import { User } from '../../../../db/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { requestData, requestType, priority = 'medium' } = body;

    // Validate request data
    if (!requestData || !requestType) {
      return NextResponse.json(
        { error: 'Missing required fields: requestData, requestType' },
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

    // Create agent request
    const agentRequest: AgentRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyId: company._id.toString(),
      requestId: requestData.id || agentRequest.id,
      type: requestType,
      data: requestData,
      priority,
      timestamp: new Date(),
      metadata: {
        userId: user._id.toString(),
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    };

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
      request: agentRequest
    };

    // Process through orchestrator
    const result = await agentOrchestrator.processRequest(agentRequest, agentContext);

    // Get cross-company insights if needed
    let insights = null;
    if (requestType === 'budget_analysis') {
      insights = crossCompanyLearning.getPredictiveInsights(company._id.toString(), agentContext);
    }

    // Get fraud risk assessment
    const fraudRisk = crossCompanyLearning.detectFraudRisk(agentRequest, agentContext);

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      result,
      insights,
      fraudRisk,
      agentMetrics: Object.fromEntries(agentOrchestrator.getAgentMetrics()),
      recommendations: result.finalDecision === 'approve' ? [] : [
        'Consider reviewing request details',
        'Check if similar requests have been approved recently',
        'Verify vendor information and pricing'
      ]
    });

  } catch (error) {
    console.error('Agent processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request through AI agents',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get orchestrator analytics
    const analytics = agentOrchestrator.getOrchestrationAnalytics();
    
    // Get available workflows
    const workflows = Object.fromEntries(agentOrchestrator.getWorkflows());
    
    return NextResponse.json({
      success: true,
      analytics,
      workflows,
      supportedRequestTypes: ['approval', 'payment', 'reimbursement', 'budget_analysis']
    });

  } catch (error) {
    console.error('Error fetching agent analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent analytics' },
      { status: 500 }
    );
  }
} 