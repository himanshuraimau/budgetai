import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/db/config';
import { Company, User } from '@/db/models';
import { z } from 'zod';

// Create company schema
const createCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  size: z.enum(['1-10', '11-50', '51-200', '200+']),
  industry: z.enum(['Tech', 'Finance', 'Healthcare', 'Retail', 'Other']),
});

// Join company schema
const joinCompanySchema = z.object({
  joinCode: z.string().min(1, 'Join code is required'),
  departmentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    await connectDB();

    // Get current user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'create') {
      // Only allow admins to create companies
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only admins can create companies' },
          { status: 403 }
        );
      }

      const validatedData = createCompanySchema.parse(body);
      
      // Use wallet service to create company with Payman integration
      const { walletService } = await import('@/lib/services/walletService');
      
      const result = await walletService.createCompanyWithWallet(
        validatedData,
        session.user.id
      );

      // Update user with company
      await User.findByIdAndUpdate(session.user.id, {
        companyId: result.company._id,
      });

      return NextResponse.json({
        success: true,
        company: {
          id: result.company._id.toString(),
          name: result.company.name,
          size: result.company.size,
          industry: result.company.industry,
          joinCode: result.companyCode,
        },
        wallet: result.wallet
      });
    } 
    
    else if (action === 'join') {
      const validatedData = joinCompanySchema.parse(body);
      
      // Find company by join code
      const company = await Company.findOne({ joinCode: validatedData.joinCode });
      
      if (!company) {
        return NextResponse.json(
          { error: 'Invalid join code' },
          { status: 400 }
        );
      }

      // Update user with company and department
      const updateData: any = {
        companyId: company._id,
        role: 'employee', // Set role to employee when joining
      };

      // Add department if provided
      if (validatedData.departmentId) {
        // Verify department belongs to this company
        const { Department } = await import('@/db/models');
        const department = await Department.findOne({ 
          _id: validatedData.departmentId, 
          companyId: company._id 
        });
        
        if (department) {
          updateData.departmentId = validatedData.departmentId;
          // Increment employee count in department
          await Department.findByIdAndUpdate(validatedData.departmentId, {
            $inc: { employeeCount: 1 }
          });
        }
      }

      await User.findByIdAndUpdate(session.user.id, updateData);

      return NextResponse.json({
        success: true,
        company: {
          id: (company as any)._id.toString(),
          name: company.name,
          size: company.size,
          industry: company.industry,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Company API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('companyId');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.companyId) {
      return NextResponse.json({
        user: {
          id: (user as any)._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          hasCompany: false,
        },
      });
    }

    const company = user.companyId as any;
    
    return NextResponse.json({
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        hasCompany: true,
        companyId: company._id.toString(),
        departmentId: user.departmentId?.toString(),
      },
      company: {
        id: company._id.toString(),
        name: company.name,
        size: company.size,
        industry: company.industry,
        joinCode: user.role === 'admin' ? company.joinCode : undefined,
      },
    });

  } catch (error) {
    console.error('Company GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
