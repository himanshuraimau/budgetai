import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '../../../../../lib/services/walletService';
import { connectDB } from '@/db/config';
import { auth } from '@/auth';
import { Company } from '@/db/models/Company';
import { User } from '@/db/models/User';
import { PurchaseRequest } from '@/db/models/PurchaseRequest';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const companyId = params.id;

    // Get company stats
    const stats = await walletService.getCompanyStats(companyId);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting company stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get company statistics',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 