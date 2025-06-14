import { NextRequest, NextResponse } from 'next/server';
import { agentOrchestrator } from '../../../../lib/agents/AgentOrchestrator';
import { crossCompanyLearning } from '../../../../lib/agents/CrossCompanyLearning';
import { AgentRequest, AgentContext } from '../../../../lib/agents/types';
import { auth } from '@/auth';
import { connectDB } from '../../../../db/config';
import { Company } from '../../../../db/models/Company';
import { User } from '../../../../db/models/User';
import { PurchaseRequest } from '../../../../db/models/PurchaseRequest';
import { Department } from '../../../../db/models/Department';
import { paymanService } from '../../../../lib/payman/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

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
    const user = await User.findById(session.user.id).populate('departmentId');
    const company = await Company.findById(user?.companyId);

    if (!user || !company) {
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      );
    }

    // Check if user has a department (required for purchase requests)
    if (!user.departmentId) {
      // Auto-assign to default department if user doesn't have one
      let defaultDepartment = await Department.findOne({ 
        companyId: company._id, 
        name: 'General' 
      });

      // Create default department if it doesn't exist
      if (!defaultDepartment) {
        defaultDepartment = new Department({
          name: 'General',
          companyId: company._id,
          monthlyBudget: 5000, // Default budget
          currentSpent: 0,
          employeeCount: 0,
          description: 'Default department for general expenses'
        });
        await defaultDepartment.save();
      }

      // Assign user to default department
      await User.findByIdAndUpdate(user._id, {
        departmentId: defaultDepartment._id
      });

      // Update user object for current request
      user.departmentId = defaultDepartment._id;
      
      // Increment employee count
      await Department.findByIdAndUpdate(defaultDepartment._id, {
        $inc: { employeeCount: 1 }
      });
    }

    // Get department info for budget context
    const department = user.departmentId as any;
    
    // Get request history for pattern analysis
    const requestHistory = await PurchaseRequest.find({
      departmentId: user.departmentId
    })
    .sort({ submittedAt: -1 })
    .limit(50)
    .lean();

    // Calculate budget context
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysLeftInMonth = Math.ceil((endOfMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfMonth = currentDate.getDate();

    const monthlySpent = await PurchaseRequest.aggregate([
      {
        $match: {
          departmentId: user.departmentId,
          status: 'approved',
          submittedAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const currentMonthSpent = monthlySpent[0]?.totalSpent || 0;
    const departmentBudget = department?.monthlyBudget || 10000;
    const remainingBudget = departmentBudget - currentMonthSpent;

    // For purchase requests, save to database first
    let savedRequest = null;
    if (requestType === 'approval' && requestData.amount && requestData.description) {
      // Validate required fields
      if (!requestData.amount || !requestData.description || !requestData.category) {
        return NextResponse.json(
          { error: 'Missing required fields: amount, description, category' },
          { status: 400 }
        );
      }

      // Create purchase request in database
      savedRequest = new PurchaseRequest({
        employeeId: user._id,
        departmentId: user.departmentId,
        amount: Number(requestData.amount),
        description: requestData.description,
        category: requestData.category,
        justification: requestData.justification,
        status: 'pending',
        submittedAt: new Date(),
      });

      await savedRequest.save();
    }

    // Create agent request
    const agentRequest: AgentRequest = {
      id: savedRequest ? savedRequest._id.toString() : `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyId: company._id.toString(),
      requestId: savedRequest ? savedRequest._id.toString() : (requestData.id || `req_${Date.now()}`),
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

    // Create comprehensive agent context
    const agentContext: AgentContext = {
      companyId: company._id.toString(),
      employeeId: user._id.toString(),
      departmentId: user.departmentId?.toString(),
      currentBudget: {
        companyMonthlyBudget: company.defaultDailyLimit * 30, // Rough estimate
        departmentMonthlyBudget: departmentBudget,
        currentMonthSpent,
        remainingBudget,
        projectedMonthlySpend: currentMonthSpent * (30 / dayOfMonth),
        dayOfMonth,
        daysLeftInMonth
      },
      spendingHistory: [], // Could be populated from historical data
      companyPolicies: {
        dailyLimit: company.defaultDailyLimit,
        transactionLimit: company.defaultTransactionLimit,
        approvalThreshold: company.defaultApprovalThreshold,
        allowedCategories: company.allowedCategories,
        restrictedVendors: [],
        autoApprovalRules: [
          {
            condition: 'amount_under_threshold',
            maxAmount: company.defaultApprovalThreshold,
            categories: company.allowedCategories,
            requiredJustification: false
          },
          {
            condition: 'trusted_category_small_amount',
            maxAmount: 100,
            categories: ['Office Supplies', 'Software'],
            requiredJustification: false
          }
        ]
      },
      requestHistory: requestHistory.map(req => ({
        requestId: req._id.toString(),
        amount: req.amount,
        category: req.category,
        approved: req.status === 'approved',
        reason: req.aiDecisionReason || '',
        timestamp: req.submittedAt,
        paymentExecuted: req.status === 'approved'
      }))
    };

    // Process through orchestrator
    const result = await agentOrchestrator.processRequest(agentRequest, agentContext);

    // Track payment execution
    let paymentExecuted = false;
    let paymentDetails = null;
    let paymentError = null;

    // Update saved request with AI decision and execute payment if approved
    if (savedRequest && result.finalDecision) {
      const status = result.finalDecision === 'approve' ? 'approved' : 
                    result.finalDecision === 'deny' ? 'denied' : 'pending';
      
      // Use the orchestrator's combined reasoning instead of raw concatenation
      const aiDecisionReason = result.reasoning || `AI Decision: ${result.finalDecision}`;

      await PurchaseRequest.findByIdAndUpdate(savedRequest._id, {
        status,
        aiDecisionReason,
        processedAt: new Date()
      });

      // If approved, execute payment and update department spending
      if (status === 'approved') {
        console.log('🚀 Executing payment for approved request:', savedRequest._id);
        console.log('   Company wallet ID:', company.paymanWalletId);
        console.log('   Request amount:', savedRequest.amount);
        
        try {
          // Execute payment via Payman using the simplified flow
          if (company.paymanWalletId) {
            // Check if employee already has a payee, if not create one
            let payee;
            
            if (user.paymanWalletId) {
              // Employee already has a payee ID stored
              console.log('   Using existing employee payee:', user.paymanWalletId);
              payee = { id: user.paymanWalletId };
            } else {
              // Create new payee for the employee (reimbursement)
              console.log('   Creating employee payee for reimbursement:', user.name);
              
              payee = await paymanService.createEmployeePayee(
                user.name,
                user._id.toString(),
                user.email
              );

              // Store the payee ID in user record for future use
              await User.findByIdAndUpdate(user._id, {
                paymanWalletId: payee.id,
                walletCreatedAt: new Date(),
                walletCreationSuccess: true
              });

              console.log('   Employee payee created and stored:', payee.id);
            }

            // Send reimbursement payment to employee
            paymentDetails = await paymanService.sendPayment(
              payee.id,
              savedRequest.amount,
              `Reimbursement for: ${requestData.description} (Vendor: ${requestData.vendor || 'N/A'})`,
              savedRequest._id.toString()
            );

            console.log('   Payment sent:', paymentDetails);
            paymentExecuted = true;

            // Update department spending
            await Department.findByIdAndUpdate(
              user.departmentId,
              { $inc: { currentSpent: savedRequest.amount } }
            );

            console.log('   ✅ Payment execution completed successfully');
          } else {
            paymentError = 'Company wallet not configured';
            console.log('   ❌ Company wallet not configured');
          }
        } catch (error) {
          console.error('❌ Payment execution error:', error);
          paymentError = error.message;
          
          // Update request status to indicate payment failed
          await PurchaseRequest.findByIdAndUpdate(savedRequest._id, {
            aiDecisionReason: `${aiDecisionReason}. Payment failed: ${error.message}`
          });
        }
      }
    }

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
      result: {
        ...result,
        paymentExecuted
      },
      insights,
      fraudRisk,
      requestId: savedRequest?._id.toString(),
      paymentDetails,
      paymentError,
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
    const session = await auth();
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