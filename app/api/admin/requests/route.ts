import { NextRequest, NextResponse } from 'next/server';
import  getServerSession  from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data - in a real app, this would come from a database
let mockRequests = [
  {
    id: "1",
    employeeId: "2",
    departmentId: "1",
    amount: 250,
    description: "New monitor for design work",
    category: "Equipment",
    status: "pending" as const,
    submittedAt: "2024-03-15T10:30:00Z",
    justification: "Current monitor is outdated and affecting productivity",
  },
  {
    id: "2", 
    employeeId: "3",
    departmentId: "2",
    amount: 1500,
    description: "Development tools subscription",
    category: "Software",
    status: "approved" as const,
    submittedAt: "2024-03-14T14:20:00Z",
    processedAt: "2024-03-15T09:15:00Z",
    aiDecisionReason: "Within department budget and essential for development work",
  },
  {
    id: "3",
    employeeId: "4",
    departmentId: "3",
    amount: 500,
    description: "Conference tickets",
    category: "Training",
    status: "denied" as const,
    submittedAt: "2024-03-13T16:45:00Z",
    processedAt: "2024-03-14T11:30:00Z",
    aiDecisionReason: "Department has exceeded training budget for this quarter",
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const departmentId = url.searchParams.get('departmentId');
    const status = url.searchParams.get('status');

    let filteredRequests = mockRequests;

    // If user is employee, only show their requests
    if ((session.user as any).role === 'employee') {
      filteredRequests = mockRequests.filter(req => req.employeeId === session.user?.id);
    }

    // Filter by department if specified
    if (departmentId && departmentId !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.departmentId === departmentId);
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.status === status);
    }

    return NextResponse.json({ requests: filteredRequests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { departmentId, amount, description, category, justification } = body;

    if (!departmentId || !amount || !description || !category) {
      return NextResponse.json({ 
        error: 'Department ID, amount, description, and category are required' 
      }, { status: 400 });
    }

    const newRequest = {
      id: Math.random().toString(36).substring(2, 9),
      employeeId: session.user.id!,
      departmentId,
      amount: Number(amount),
      description,
      category,
      status: "pending" as const,
      submittedAt: new Date().toISOString(),
      ...(justification && { justification }),
    };

    mockRequests.push(newRequest);

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
