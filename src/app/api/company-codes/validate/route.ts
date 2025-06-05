import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '../../../../lib/services/walletService';
import { connectDB } from '../../../../db/config';
import { isValidCompanyCodeFormat } from '../../../../lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { companyCode } = await request.json();
    
    // Validate required field
    if (!companyCode) {
      return NextResponse.json(
        { error: 'Company code is required' },
        { status: 400 }
      );
    }

    // Check format first
    if (!isValidCompanyCodeFormat(companyCode)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid company code format. Should be 3 letters followed by 3 numbers (e.g., ABC123)'
      });
    }

    // Validate company code exists
    const validation = await walletService.validateCompanyCode(companyCode.toUpperCase());

    return NextResponse.json({
      valid: validation.valid,
      companyName: validation.companyName,
      error: validation.error
    });

  } catch (error) {
    console.error('Error validating company code:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Validation failed. Please try again.' 
      },
      { status: 500 }
    );
  }
} 