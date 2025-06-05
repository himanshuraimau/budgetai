import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/db/config';
import { Department, User } from '@/db/models';

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

    // Fetch departments from database for the user's company
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
