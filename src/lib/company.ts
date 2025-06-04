import { connectDB } from '@/src/db/config';
import { Company, type ICompany } from '@/src/db/models/Company';
import mongoose from 'mongoose';

/**
 * Create a default company for new admin users
 */
export async function createDefaultCompany(adminId: string, companyName: string = "My Company"): Promise<ICompany> {
  try {
    await connectDB();
    
    const company = new Company({
      name: companyName,
      size: '1-10',
      industry: 'Tech',
      adminId: new mongoose.Types.ObjectId(adminId),
    });

    await company.save();
    return company;
  } catch (error) {
    console.error('Error creating default company:', error);
    throw error;
  }
}

/**
 * Find company by ID
 */
export async function findCompanyById(companyId: string): Promise<ICompany | null> {
  try {
    await connectDB();
    return await Company.findById(companyId);
  } catch (error) {
    console.error('Error finding company:', error);
    return null;
  }
}
