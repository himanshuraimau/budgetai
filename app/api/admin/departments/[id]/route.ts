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

    // Check if user is admin
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, monthlyBudget, employeeCount } = body;
    const departmentId = params.id;

    // TODO: Update department in database
    // const updatedDepartment = await updateDepartment(departmentId, {
    //   companyId: session.user.companyId,
    //   name,
    //   monthlyBudget: Number(monthlyBudget),
    //   employeeCount: Number(employeeCount)
    // });

    // if (!updatedDepartment) {
    //   return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    // }

    const updatedDepartment = {
      id: departmentId,
      companyId: (session.user as any).companyId || "1",
      name,
      monthlyBudget: Number(monthlyBudget),
      employeeCount: Number(employeeCount) || 0,
      currentSpent: 0, // This would come from database
    };

    return NextResponse.json({ department: updatedDepartment });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const departmentId = params.id;

    // TODO: Delete department from database
    // const deleted = await deleteDepartment(departmentId, session.user.companyId);
    
    // if (!deleted) {
    //   return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    // }

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
