import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/src/db/config';
import { PurchaseRequest, User } from '@/src/db/models';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user with company info
    const user = await User.findById(session.user.id);
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or not associated with a company' }, { status: 404 });
    }

    const url = new URL(request.url);
    const departmentId = url.searchParams.get('departmentId');
    const status = url.searchParams.get('status');

    // Build query filter
    let filter: any = {};
    
    // For employees, only show their own requests
    if (user.role === 'employee') {
      filter.employeeId = user._id;
    }
    
    // Add department filter if specified and not 'all'
    if (departmentId && departmentId !== 'all') {
      filter.departmentId = departmentId;
    }
    
    // Add status filter if specified and not 'all'
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Fetch requests from database with population
    const requests = await PurchaseRequest.find(filter)
      .populate('employeeId', 'name email')
      .populate('departmentId', 'name')
      .sort({ submittedAt: -1 })
      .lean();

    const formattedRequests = requests.map(req => ({
      id: req._id.toString(),
      employeeId: req.employeeId._id.toString(),
      employeeName: (req.employeeId as any).name,
      employeeEmail: (req.employeeId as any).email,
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
    console.error('Error fetching requests:', error);
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
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { departmentId, amount, description, category, justification } = body;

    if (!departmentId || !amount || !description || !category) {
      return NextResponse.json({ 
        error: 'Department ID, amount, description, and category are required' 
      }, { status: 400 });
    }

    // Create request in database
    const newRequest = new PurchaseRequest({
      employeeId: session.user.id,
      departmentId,
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
      .populate('employeeId', 'name email')
      .populate('departmentId', 'name')
      .lean();

    const formattedRequest = {
      id: (populatedRequest as any)._id.toString(),
      employeeId: (populatedRequest as any).employeeId._id.toString(),
      employeeName: (populatedRequest as any).employeeId.name,
      employeeEmail: (populatedRequest as any).employeeId.email,
      departmentId: (populatedRequest as any).departmentId._id.toString(),
      departmentName: (populatedRequest as any).departmentId.name,
      amount: (populatedRequest as any).amount,
      description: (populatedRequest as any).description,
      category: (populatedRequest as any).category,
      justification: (populatedRequest as any).justification,
      status: (populatedRequest as any).status,
      submittedAt: (populatedRequest as any).submittedAt.toISOString(),
    };

    return NextResponse.json({ request: formattedRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
