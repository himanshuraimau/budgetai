import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '../../../../lib/services/walletService';
import { connectDB } from '../../../../db/config';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { name, email, password, role, companyCode } = body;
    
    // Validate required fields
    if (!name || !email || !password || !role || !companyCode) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, role, companyCode' },
        { status: 400 }
      );
    }

    // Validate company code first
    const validation = await walletService.validateCompanyCode(companyCode);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid company code' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create employee with wallet
    const result = await walletService.onboardEmployeeWithWallet(
      {
        name,
        email,
        password: hashedPassword,
        role
      },
      companyCode
    );

    // Remove password from response
    const { password: _, ...employeeData } = result.employee;

    return NextResponse.json({
      success: true,
      data: {
        employee: employeeData,
        wallet: result.wallet,
        auditId: result.auditId,
        companyName: validation.companyName
      }
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    
    // Handle specific error cases
    if (error.message.includes('E11000')) {
      return NextResponse.json(
        { error: 'Email address is already registered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create employee account',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 