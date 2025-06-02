import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch employee's requests from database
    // const userRequests = await getRequestsByEmployee(session.user.id);

    return NextResponse.json({ requests: [] });
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

    // TODO: Create request in database
    // const newRequest = await createRequest({
    //   employeeId: session.user.id,
    //   departmentId: session.user.departmentId,
    //   amount: Number(amount),
    //   description,
    //   category,
    //   justification
    // });

    const newRequest = {
      id: `req_${Date.now()}`,
      employeeId: session.user.id,
      departmentId: (session.user as any).departmentId || "1",
      amount: Number(amount),
      description,
      category,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
      justification,
    };

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
