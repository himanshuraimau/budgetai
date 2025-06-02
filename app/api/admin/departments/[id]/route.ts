import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// This would be the same mock data as in route.ts
let mockDepartments = [
  {
    id: "1",
    companyId: "1",
    name: "Marketing",
    monthlyBudget: 10000,
    currentSpent: 3500,
    employeeCount: 5,
  },
  {
    id: "2",
    companyId: "1", 
    name: "Engineering",
    monthlyBudget: 25000,
    currentSpent: 18500,
    employeeCount: 12,
  },
  {
    id: "3",
    companyId: "1",
    name: "Sales",
    monthlyBudget: 15000,
    currentSpent: 9000,
    employeeCount: 8,
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

    // Check if user is admin
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, monthlyBudget, employeeCount } = body;
    const departmentId = params.id;

    const departmentIndex = mockDepartments.findIndex(
      dept => dept.id === departmentId && dept.companyId === (session.user as any).companyId
    );

    if (departmentIndex === -1) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Update department
    mockDepartments[departmentIndex] = {
      ...mockDepartments[departmentIndex],
      ...(name && { name }),
      ...(monthlyBudget && { monthlyBudget: Number(monthlyBudget) }),
      ...(employeeCount !== undefined && { employeeCount: Number(employeeCount) }),
    };

    return NextResponse.json({ department: mockDepartments[departmentIndex] });
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
    const companyId = (session.user as any).companyId || "1";

    const departmentIndex = mockDepartments.findIndex(
      dept => dept.id === departmentId && dept.companyId === companyId
    );

    if (departmentIndex === -1) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Remove department
    mockDepartments.splice(departmentIndex, 1);

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
