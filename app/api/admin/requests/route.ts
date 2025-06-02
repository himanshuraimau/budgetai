import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const departmentId = url.searchParams.get('departmentId');
    const status = url.searchParams.get('status');

    // TODO: Fetch requests from database based on filters
    // const requests = await getRequests({
    //   companyId: session.user.companyId,
    //   departmentId: departmentId !== 'all' ? departmentId : undefined,
    //   status: status !== 'all' ? status : undefined,
    //   employeeId: session.user.role === 'employee' ? session.user.id : undefined
    // });

    return NextResponse.json({ requests: [] });
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

    const body = await request.json();
    const { departmentId, amount, description, category, justification } = body;

    if (!departmentId || !amount || !description || !category) {
      return NextResponse.json({ 
        error: 'Department ID, amount, description, and category are required' 
      }, { status: 400 });
    }

    // TODO: Create request in database
    // const newRequest = await createRequest({
    //   employeeId: session.user.id,
    //   departmentId,
    //   amount: Number(amount),
    //   description,
    //   category,
    //   justification
    // });

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

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
