import { NextRequest, NextResponse } from 'next/server';
import  getServerSession  from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data - in a real app, this would come from a database
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, filter by user's company
    const companyId = (session.user as any).companyId || "1";
    const departments = mockDepartments.filter(dept => dept.companyId === companyId);

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
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

    const companyId = (session.user as any).companyId || "1";
    const newDepartment = {
      id: Math.random().toString(36).substring(2, 9),
      companyId,
      name,
      monthlyBudget: Number(monthlyBudget),
      currentSpent: 0,
      employeeCount: Number(employeeCount) || 0,
    };

    mockDepartments.push(newDepartment);

    return NextResponse.json({ department: newDepartment }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
