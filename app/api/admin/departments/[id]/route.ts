import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/db/config';
import { Department, User } from '@/db/models';

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

    await connectDB();

    // Get user with company info
    const user = await User.findById(session.user.id);
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or not associated with a company' }, { status: 404 });
    }

    const body = await request.json();
    const { name, monthlyBudget, employeeCount } = body;
    const departmentId = (await params).id;

    // Update department in database
    const updatedDepartment = await Department.findOneAndUpdate(
      { _id: departmentId, companyId: user.companyId },
      {
        name,
        monthlyBudget: Number(monthlyBudget),
        employeeCount: Number(employeeCount)
      },
      { new: true }
    );

    if (!updatedDepartment) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const formattedDepartment = {
      id: (updatedDepartment as any)._id.toString(),
      companyId: updatedDepartment.companyId.toString(),
      name: updatedDepartment.name,
      monthlyBudget: updatedDepartment.monthlyBudget,
      employeeCount: updatedDepartment.employeeCount,
      currentSpent: updatedDepartment.currentSpent,
    };

    return NextResponse.json({ department: formattedDepartment });
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

    await connectDB();

    // Get user with company info
    const user = await User.findById(session.user.id);
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or not associated with a company' }, { status: 404 });
    }

    const departmentId = (await params).id;

    // Delete department from database
    const deleted = await Department.findOneAndDelete({ 
      _id: departmentId, 
      companyId: user.companyId 
    });
    
    if (!deleted) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Also remove this department from users who are assigned to it
    await User.updateMany(
      { departmentId: departmentId },
      { $unset: { departmentId: 1 } }
    );

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
