import { NextRequest, NextResponse } from 'next/server';
import  getServerSession  from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data - in a real app, this would come from a database
const mockCompany = {
  id: "1",
  name: "Acme Corporation",
  size: "51-200",
  industry: "Tech",
  totalBudget: 50000,
  totalSpent: 31000,
  employeeCount: 25,
  departmentCount: 3,
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, filter by user's company
    return NextResponse.json({ company: mockCompany });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { name, size, industry } = body;

    // Update company data (in a real app, this would update the database)
    const updatedCompany = {
      ...mockCompany,
      ...(name && { name }),
      ...(size && { size }),
      ...(industry && { industry }),
    };

    return NextResponse.json({ company: updatedCompany });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
