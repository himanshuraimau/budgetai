import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/src/db/config';
import { PurchaseRequest, User, Department } from '@/src/db/models';

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

    await connectDB();

    const body = await request.json();
    const { status, aiDecisionReason } = body;
    const requestId = (await params).id;

    if (!['pending', 'approved', 'denied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update request in database
    const updatedRequest = await PurchaseRequest.findByIdAndUpdate(
      requestId,
      {
        status,
        aiDecisionReason,
        processedAt: new Date()
      },
      { new: true }
    ).populate('employeeId', 'name email').populate('departmentId', 'name');

    if (!updatedRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // If approved, update department spending
    if (status === 'approved') {
      await Department.findByIdAndUpdate(
        updatedRequest.departmentId,
        { $inc: { currentSpent: updatedRequest.amount } }
      );
    }

    const formattedRequest = {
      id: (updatedRequest as any)._id.toString(),
      employeeId: (updatedRequest as any).employeeId._id.toString(),
      employeeName: (updatedRequest as any).employeeId.name,
      employeeEmail: (updatedRequest as any).employeeId.email,
      departmentId: (updatedRequest as any).departmentId._id.toString(),
      departmentName: (updatedRequest as any).departmentId.name,
      amount: updatedRequest.amount,
      description: updatedRequest.description,
      category: updatedRequest.category,
      justification: updatedRequest.justification,
      status: updatedRequest.status,
      aiDecisionReason: updatedRequest.aiDecisionReason,
      submittedAt: updatedRequest.submittedAt.toISOString(),
      processedAt: updatedRequest.processedAt?.toISOString(),
    };

    return NextResponse.json({ request: formattedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
