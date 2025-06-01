import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/auth';
import { saltAndHashPassword } from '@/utils/password';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "employee"]),
  companyId: z.string().optional(),
  departmentId: z.string().optional(),
  inviteCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = saltAndHashPassword(validatedData.password);

    // Create the user (company will be set during onboarding)
    const user = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
      companyId: validatedData.companyId,
      departmentId: validatedData.departmentId,
      inviteCode: validatedData.inviteCode,
    });

    // Return user data without password
    const userData = {
      id: (user as any)._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId?.toString() || '',
      departmentId: user.departmentId?.toString(),
      onboardingCompleted: user.onboardingCompleted,
    };

    return NextResponse.json({ user: userData }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
