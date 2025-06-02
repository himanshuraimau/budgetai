import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Mock data for now - will be replaced with database calls
const mockRequests = [
  {
    id: '1',
    employeeId: 'emp1',
    departmentId: 'dept1',
    amount: 500,
    description: 'Office supplies for Q1',
    category: 'Office Supplies',
    status: 'approved' as const,
    submittedAt: '2024-12-01T10:00:00Z',
    processedAt: '2024-12-02T14:30:00Z',
    justification: 'Required for daily operations',
    aiDecisionReason: 'Approved: Within budget and reasonable request'
  },
  {
    id: '2',
    employeeId: 'emp1',
    departmentId: 'dept1',
    amount: 1200,
    description: 'New monitor for development work',
    category: 'Equipment',
    status: 'pending' as const,
    submittedAt: '2024-12-05T09:15:00Z',
    justification: 'Current monitor is too small for development tasks'
  },
  {
    id: '3',
    employeeId: 'emp2',
    departmentId: 'dept2',
    amount: 250,
    description: 'Team lunch for project completion',
    category: 'Team Building',
    status: 'denied' as const,
    submittedAt: '2024-12-03T16:45:00Z',
    processedAt: '2024-12-04T11:20:00Z',
    justification: 'Celebrate successful project delivery',
    aiDecisionReason: 'Denied: Exceeds team building budget for this month'
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Filter requests for the current user
    const userRequests = mockRequests.filter(req => req.employeeId === session.user.id);

    return NextResponse.json({ requests: userRequests });
  } catch (error) {
    console.error('Error fetching employee requests:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, category, justification } = body;

    // Validation
    if (!amount || !description || !category) {
      return NextResponse.json(
        { message: 'Amount, description, and category are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create new request
    const newRequest = {
      id: `req_${Date.now()}`,
      employeeId: session.user.id,
      departmentId: session.user.departmentId || 'dept1',
      amount: Number(amount),
      description,
      category,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
      justification,
    };

    // In a real app, this would be saved to the database
    mockRequests.push(newRequest);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
