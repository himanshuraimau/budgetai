import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/src/db/config';
import { Department, User } from '@/src/db/models';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const joinCode = searchParams.get('joinCode');

    if (!joinCode) {
      return NextResponse.json(
        { error: 'Join code is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find company by join code
    const { Company } = await import('@/src/db/models');
    const company = await Company.findOne({ joinCode });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Invalid join code' },
        { status: 404 }
      );
    }

    // Get departments for this company
    const departments = await Department.find({ companyId: company._id }).lean();
    
    const formattedDepartments = departments.map(dept => ({
      id: dept._id.toString(),
      name: dept.name,
      monthlyBudget: dept.monthlyBudget,
      employeeCount: dept.employeeCount,
    }));

    return NextResponse.json({
      company: {
        id: (company as any)._id.toString(),
        name: company.name,
        size: company.size,
        industry: company.industry,
      },
      departments: formattedDepartments,
    });

  } catch (error) {
    console.error('Departments preview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
