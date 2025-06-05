import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/db/config';
import { PurchaseRequest, User } from '@/db/models';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch employee's requests from database
    const userRequests = await PurchaseRequest.find({ employeeId: session.user.id })
      .populate('departmentId', 'name')
      .sort({ submittedAt: -1 })
      .lean();

    const formattedRequests = userRequests.map(req => ({
      id: req._id.toString(),
      employeeId: req.employeeId.toString(),
      departmentId: req.departmentId._id.toString(),
      departmentName: (req.departmentId as any).name,
      amount: req.amount,
      description: req.description,
      category: req.category,
      justification: req.justification,
      status: req.status,
      aiDecisionReason: req.aiDecisionReason,
      submittedAt: req.submittedAt.toISOString(),
      processedAt: req.processedAt?.toISOString(),
    }));

    return NextResponse.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Error fetching employee requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user with department info
    const user = await User.findById(session.user.id);
    if (!user || !user.departmentId) {
      return NextResponse.json({ error: 'User not found or not assigned to a department' }, { status: 404 });
    }

    const body = await request.json();
    const { amount, description, category, justification } = body;

    // Validation
    if (!amount || !description || !category) {
      return NextResponse.json(
        { error: 'Amount, description, and category are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create request in database
    const newRequest = new PurchaseRequest({
      employeeId: session.user.id,
      departmentId: user.departmentId,
      amount: Number(amount),
      description,
      category,
      justification,
      status: 'pending',
      submittedAt: new Date(),
    });

    await newRequest.save();

    // Populate the saved request to return complete data
    const populatedRequest = await PurchaseRequest.findById(newRequest._id)
      .populate('departmentId', 'name')
      .lean();

    const formattedRequest = {
      id: (populatedRequest as any)._id.toString(),
      employeeId: (populatedRequest as any).employeeId.toString(),
      departmentId: (populatedRequest as any).departmentId._id.toString(),
      departmentName: (populatedRequest as any).departmentId.name,
      amount: (populatedRequest as any).amount,
      description: (populatedRequest as any).description,
      category: (populatedRequest as any).category,
      justification: (populatedRequest as any).justification,
      status: (populatedRequest as any).status,
      submittedAt: (populatedRequest as any).submittedAt.toISOString(),
    };

    return NextResponse.json(formattedRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
