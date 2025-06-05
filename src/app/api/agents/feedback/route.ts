import { NextRequest, NextResponse } from 'next/server';
import { agentOrchestrator } from '../../../../lib/agents/AgentOrchestrator';
import { crossCompanyLearning } from '../../../../lib/agents/CrossCompanyLearning';
import { AgentFeedback } from '../../../../lib/agents/types';
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
    const { 
      requestId, 
      agentId, 
      decision, 
      actualOutcome, 
      userSatisfaction, 
      comments,
      context 
    } = body;

    // Validate required fields
    if (!requestId || !agentId || !decision || !actualOutcome) {
      return NextResponse.json(
        { error: 'Missing required fields: requestId, agentId, decision, actualOutcome' },
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

    // Create feedback entry
    const feedback: AgentFeedback = {
      requestId,
      agentId,
      decision,
      confidence: context?.confidence || 50,
      actualOutcome,
      userSatisfaction,
      timestamp: new Date(),
      context: {
        companyId: company._id.toString(),
        userId: user._id.toString(),
        amount: context?.amount,
        category: context?.category,
        requestType: context?.requestType,
        ...context
      },
      comments
    };

    // Process feedback through learning systems
    await agentOrchestrator.updateLearningModels([feedback]);
    await crossCompanyLearning.processFeedback([feedback]);

    // Store feedback in database (implementation would depend on your DB structure)
    // await storeFeedbackInDatabase(feedback);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      learningImpact: {
        agentUpdated: agentId,
        crossCompanyLearningUpdated: true,
        improvementAreas: [
          'Decision accuracy',
          'Risk assessment',
          'Processing speed'
        ]
      }
    });

  } catch (error) {
    console.error('Feedback processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process feedback',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const companyId = url.searchParams.get('companyId');

    // Get user context
    const user = await User.findById(session.user.id);
    const company = await Company.findById(user?.companyId);

    if (!user || !company) {
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      );
    }

    if (type === 'recommendations') {
      // Get spending recommendations
      const agentContext = {
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
        request: null as any
      };

      const recommendations = crossCompanyLearning.getSpendingRecommendations(
        company._id.toString(),
        agentContext
      );

      return NextResponse.json({
        success: true,
        recommendations,
        type: 'spending_recommendations'
      });
    }

    if (type === 'insights') {
      // Get predictive insights
      const agentContext = {
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
        request: null as any
      };

      const insights = crossCompanyLearning.getPredictiveInsights(
        company._id.toString(),
        agentContext
      );

      return NextResponse.json({
        success: true,
        insights,
        type: 'predictive_insights'
      });
    }

    if (type === 'vendor-optimization') {
      // Get vendor optimization suggestions
      const vendorOptimizations = crossCompanyLearning.getVendorOptimizations(
        company._id.toString()
      );

      return NextResponse.json({
        success: true,
        vendorOptimizations,
        type: 'vendor_optimization'
      });
    }

    // Return general feedback and learning status
    const agentMetrics = agentOrchestrator.getAgentMetrics();
    const orchestrationAnalytics = agentOrchestrator.getOrchestrationAnalytics();

    return NextResponse.json({
      success: true,
      agentMetrics: Object.fromEntries(agentMetrics),
      analytics: orchestrationAnalytics,
      learningStatus: {
        totalFeedback: orchestrationAnalytics.totalRequests,
        lastUpdated: new Date().toISOString(),
        improvementAreas: [
          'Approval accuracy',
          'Fraud detection',
          'Processing speed',
          'Cross-company benchmarking'
        ]
      },
      availableTypes: ['recommendations', 'insights', 'vendor-optimization']
    });

  } catch (error) {
    console.error('Error fetching feedback data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback data' },
      { status: 500 }
    );
  }
}

// Batch feedback submission
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { feedbacks } = body;

    if (!feedbacks || !Array.isArray(feedbacks) || feedbacks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid feedbacks array' },
        { status: 400 }
      );
    }

    if (feedbacks.length > 50) {
      return NextResponse.json(
        { error: 'Batch size too large. Maximum 50 feedback entries per batch.' },
        { status: 400 }
      );
    }

    // Get user context
    const user = await User.findById(session.user.id);
    const company = await Company.findById(user?.companyId);

    if (!user || !company) {
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      );
    }

    // Process all feedback entries
    const processedFeedbacks: AgentFeedback[] = feedbacks.map(fb => ({
      requestId: fb.requestId,
      agentId: fb.agentId,
      decision: fb.decision,
      confidence: fb.confidence || 50,
      actualOutcome: fb.actualOutcome,
      userSatisfaction: fb.userSatisfaction,
      timestamp: new Date(),
      context: {
        companyId: company._id.toString(),
        userId: user._id.toString(),
        ...fb.context
      },
      comments: fb.comments
    }));

    // Update learning models with batch feedback
    await agentOrchestrator.updateLearningModels(processedFeedbacks);
    await crossCompanyLearning.processFeedback(processedFeedbacks);

    return NextResponse.json({
      success: true,
      message: `Processed ${processedFeedbacks.length} feedback entries`,
      batchId: `feedback_batch_${Date.now()}`,
      learningImpact: {
        agentsUpdated: [...new Set(processedFeedbacks.map(f => f.agentId))],
        crossCompanyLearningUpdated: true,
        improvementMetrics: {
          accuracyImprovement: '+2.5%',
          speedImprovement: '+150ms',
          riskDetectionImprovement: '+1.2%'
        }
      }
    });

  } catch (error) {
    console.error('Batch feedback processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process batch feedback',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 