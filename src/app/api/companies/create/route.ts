import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/db/config';
import { auth } from '@/auth';
import { Company } from '@/db/models/Company';
import { User } from '@/db/models/User';
import { walletService } from '@/lib/services/walletService';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const companyData = await request.json();
    
    // Validate required fields
    if (!companyData.name || !companyData.size || !companyData.industry) {
      return NextResponse.json(
        { error: 'Missing required fields: name, size, industry' },
        { status: 400 }
      );
    }

    // Create company with wallet
    const result = await walletService.createCompanyWithWallet(
      companyData,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        company: result.company,
        companyCode: result.companyCode,
        wallet: result.wallet
      }
    });

  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create company',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 