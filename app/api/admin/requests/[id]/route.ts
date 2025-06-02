import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// This would be the same mock data as in route.ts
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin for status updates
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { status, aiDecisionReason } = body;
    const requestId = params.id;

    if (!status || !['approved', 'denied', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required' }, { status: 400 });
    }

    const requestIndex = mockRequests.findIndex(req => req.id === requestId);

    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update request status
    mockRequests[requestIndex] = {
      ...mockRequests[requestIndex],
      status: status as 'approved' | 'denied' | 'pending',
      processedAt: new Date().toISOString(),
      ...(aiDecisionReason && { aiDecisionReason }),
    };

    return NextResponse.json({ request: mockRequests[requestIndex] });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
