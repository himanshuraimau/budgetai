import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/db/config';
import { User, Company, Department } from '@/db/models';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// Validation schemas
const companySetupSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  size: z.enum(['1-10', '11-50', '51-200', '200+']),
  industry: z.enum(['Tech', 'Finance', 'Healthcare', 'Retail', 'Other']),
});

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  monthlyBudget: z.number().min(0, 'Budget must be positive'),
});

const onboardingSchema = z.object({
  step: z.enum(['company', 'departments', 'join', 'department', 'payman', 'complete']),
  userRole: z.enum(['admin', 'employee']),
  companySetup: companySetupSchema.optional(),
  departments: z.array(departmentSchema).optional(),
  selectedDepartmentId: z.string().optional(),
  inviteCode: z.string().optional(),
  paymanConnected: z.boolean().optional(),
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
    const validatedData = onboardingSchema.parse(body);

    await connectDB();

    // Get current user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user has already completed onboarding, don't allow changes
    if (user.onboardingCompleted) {
      return NextResponse.json(
        { error: 'Onboarding already completed' },
        { status: 400 }
      );
    }

    let companyId = user.companyId;
    let departmentId = user.departmentId;

    // Handle different onboarding steps
    switch (validatedData.step) {
      case 'company':
        if (validatedData.userRole === 'admin' && validatedData.companySetup) {
          // Create company for admin
          const company = new Company({
            name: validatedData.companySetup.name,
            size: validatedData.companySetup.size,
            industry: validatedData.companySetup.industry,
            adminId: new mongoose.Types.ObjectId(session.user.id),
          });

          await company.save();
          companyId = company._id as mongoose.Types.ObjectId;

          // Update user with company
          await User.findByIdAndUpdate(session.user.id, {
            companyId: company._id,
            role: 'admin',
          });
        }
        break;

      case 'departments':
        if (validatedData.userRole === 'admin' && validatedData.departments && companyId) {
          // Create departments for the company
          const departmentDocs = validatedData.departments.map(dept => ({
            companyId: companyId,
            name: dept.name,
            monthlyBudget: dept.monthlyBudget,
            currentSpent: 0,
            employeeCount: 0,
          }));

          await Department.insertMany(departmentDocs);
        }
        break;

      case 'join':
        if (validatedData.userRole === 'employee' && validatedData.inviteCode) {
          // Find company by invite code (for now, mock this)
          // In a real implementation, you'd have an invite system
          const company = await Company.findOne({ name: { $regex: validatedData.inviteCode, $options: 'i' } });
          
          if (company) {
            companyId = company._id as mongoose.Types.ObjectId;
            await User.findByIdAndUpdate(session.user.id, {
              companyId: company._id,
              role: 'employee',
              inviteCode: validatedData.inviteCode,
            });
          } else {
            return NextResponse.json(
              { error: 'Invalid invite code' },
              { status: 400 }
            );
          }
        }
        break;

      case 'department':
        if (validatedData.userRole === 'employee' && validatedData.selectedDepartmentId && companyId) {
          // Assign employee to department
          const department = await Department.findOne({
            _id: validatedData.selectedDepartmentId,
            companyId: companyId,
          });

          if (department) {
            departmentId = department._id as mongoose.Types.ObjectId;;
            
            // Update user with department
            await User.findByIdAndUpdate(session.user.id, {
              departmentId: department._id,
            });

            // Increment employee count
            await Department.findByIdAndUpdate(department._id, {
              $inc: { employeeCount: 1 }
            });
          } else {
            return NextResponse.json(
              { error: 'Invalid department selection' },
              { status: 400 }
            );
          }
        }
        break;

      case 'payman':
        // Handle Payman integration (placeholder for now)
        // In a real implementation, this would set up payment provider integration
        break;

      case 'complete':
        // Mark onboarding as completed
        await User.findByIdAndUpdate(session.user.id, {
          onboardingCompleted: true,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid onboarding step' },
          { status: 400 }
        );
    }

    // Get updated user data
    const updatedUser = await User.findById(session.user.id).populate('companyId').populate('departmentId');

    return NextResponse.json({
      success: true,
      user: {
        id: (updatedUser as any)._id.toString(),
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        companyId: updatedUser?.companyId?._id?.toString(),
        departmentId: updatedUser?.departmentId?._id?.toString(),
        onboardingCompleted: updatedUser?.onboardingCompleted,
      },
    });

  } catch (error) {
    console.error('Onboarding API error:', error);
    
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

// GET endpoint to fetch onboarding-related data
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
    const type = searchParams.get('type');

    await connectDB();

    const user = await User.findById(session.user.id).populate<{ companyId: { name: string; size: string; industry: string; _id: mongoose.Types.ObjectId } }>('companyId');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    switch (type) {
      case 'departments':
        // Get departments for the user's company
        if (user.companyId) {
          const departments = await Department.find({ companyId: user.companyId });
          return NextResponse.json({ departments });
        }
        return NextResponse.json({ departments: [] });

      case 'user':
        // Get current user data
        return NextResponse.json({
          user: {
            id: (user as any)._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId?._id?.toString(),
            departmentId: user.departmentId?.toString(),
            onboardingCompleted: user.onboardingCompleted,
            company: user.companyId ? {
              id: user.companyId._id.toString(),
              name: user.companyId.name,
              size: user.companyId.size,
              industry: user.companyId.industry,
            } : null,
          },
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Onboarding GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
