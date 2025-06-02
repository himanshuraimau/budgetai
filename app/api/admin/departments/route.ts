import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch departments from database
    // const departments = await getDepartmentsByCompany(session.user.companyId);
    
    return NextResponse.json({ departments: [] });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, monthlyBudget, employeeCount } = body;

    if (!name || !monthlyBudget) {
      return NextResponse.json({ error: 'Name and monthly budget are required' }, { status: 400 });
    }

    // TODO: Create department in database
    // const newDepartment = await createDepartment({
    //   companyId: session.user.companyId,
    //   name,
    //   monthlyBudget: Number(monthlyBudget),
    //   employeeCount: Number(employeeCount) || 0
    // });

    const newDepartment = {
      id: Math.random().toString(36).substring(2, 9),
      companyId: (session.user as any).companyId || "1",
      name,
      monthlyBudget: Number(monthlyBudget),
      currentSpent: 0,
      employeeCount: Number(employeeCount) || 0,
    };

    return NextResponse.json({ department: newDepartment }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
