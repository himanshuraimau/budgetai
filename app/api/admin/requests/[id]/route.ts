import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

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

    if (!['pending', 'approved', 'denied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // TODO: Update request in database
    // const updatedRequest = await updateRequestStatus(requestId, {
    //   status,
    //   aiDecisionReason,
    //   processedAt: new Date().toISOString()
    // });

    // if (!updatedRequest) {
    //   return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    // }

    const updatedRequest = {
      id: requestId,
      status,
      ...(aiDecisionReason && { aiDecisionReason }),
      processedAt: new Date().toISOString(),
    };

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
