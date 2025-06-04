import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/src/db/config';
import { Department, User } from '@/src/db/models';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user with company info
    const user = await User.findById(session.user.id);
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or not associated with a company' }, { status: 404 });
    }

    // Fetch departments from database
    const departments = await Department.find({ companyId: user.companyId }).lean();
    
    const formattedDepartments = departments.map(dept => ({
      id: dept._id.toString(),
      companyId: dept.companyId.toString(),
      name: dept.name,
      monthlyBudget: dept.monthlyBudget,
      currentSpent: dept.currentSpent,
      employeeCount: dept.employeeCount,
    }));
    
    return NextResponse.json({ departments: formattedDepartments });
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

    await connectDB();

    // Get user with company info
    const user = await User.findById(session.user.id);
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or not associated with a company' }, { status: 404 });
    }

    const body = await request.json();
    const { name, monthlyBudget, employeeCount } = body;

    if (!name || !monthlyBudget) {
      return NextResponse.json({ error: 'Name and monthly budget are required' }, { status: 400 });
    }

    // Create department in database
    const newDepartment = new Department({
      companyId: user.companyId,
      name,
      monthlyBudget: Number(monthlyBudget),
      currentSpent: 0,
      employeeCount: Number(employeeCount) || 0
    });

    await newDepartment.save();

    const formattedDepartment = {
      id: (newDepartment as any)._id.toString(),
      companyId: newDepartment.companyId.toString(),
      name: newDepartment.name,
      monthlyBudget: newDepartment.monthlyBudget,
      currentSpent: newDepartment.currentSpent,
      employeeCount: newDepartment.employeeCount,
    };

    return NextResponse.json({ department: formattedDepartment }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
