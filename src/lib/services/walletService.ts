import { paymanService } from '../payman/client';
import { Company } from '../../db/models/Company';
import { User } from '../../db/models/User';
import { OnboardingAudit } from '../../db/models/OnboardingAudit';
import { generateCompanyCode } from '../utils';
import type { CompanySetup, SignUpFormValues } from '../../types';

export interface WalletCreationResult {
  success: boolean;
  walletId?: string;
  error?: string;
}

export interface CompanyWithWallet {
  company: any;
  companyCode: string;
  wallet: WalletCreationResult;
}

export interface EmployeeOnboardingResult {
  employee: any;
  wallet: WalletCreationResult;
  auditId: string;
}

export class WalletService {
  
  /**
   * Enhanced company creation with automatic wallet setup
   */
  async createCompanyWithWallet(companyData: CompanySetup, adminId: string): Promise<CompanyWithWallet> {
    try {
      // Generate unique company code (using your existing logic)
      const companyCode = generateCompanyCode();
      
      // Create company in database
      const company = new Company({
        ...companyData,
        adminId,
        joinCode: companyCode,
        employeeCount: 0,
      });
      
      await company.save();
      
      // Create company wallet via Payman
      let walletResult: WalletCreationResult;
      try {
        const wallet = await paymanService.createCompanyWallet(company.name, company._id.toString());
        
        // Update company with wallet info
        company.paymanWalletId = wallet.id;
        company.walletCreatedAt = new Date();
        company.walletCreationSuccess = true;
        await company.save();
        
        walletResult = {
          success: true,
          walletId: wallet.id
        };
        
      } catch (walletError) {
        console.error('Failed to create company wallet:', walletError);
        
        // Update company with failure info
        company.walletCreationSuccess = false;
        await company.save();
        
        walletResult = {
          success: false,
          error: walletError.message
        };
      }
      
      return {
        company: company.toObject(),
        companyCode,
        wallet: walletResult
      };
      
    } catch (error) {
      console.error('Error in createCompanyWithWallet:', error);
      throw new Error(`Failed to create company with wallet: ${error.message}`);
    }
  }

  /**
   * Enhanced employee onboarding with company code validation and wallet creation
   */
  async onboardEmployeeWithWallet(
    employeeData: SignUpFormValues, 
    companyCode: string
  ): Promise<EmployeeOnboardingResult> {
    
    // Start audit tracking
    const auditRecord = new OnboardingAudit({
      companyCode,
      employeeEmail: employeeData.email,
      walletCreationSuccess: false,
    });
    
    try {
      // Validate company code exists
      const company = await Company.findOne({ joinCode: companyCode });
      if (!company) {
        throw new Error('Invalid company code');
      }
      
      // Add company info to audit
      auditRecord.companyId = company._id;
      await auditRecord.save();
      
      // Create employee account
      const employee = new User({
        ...employeeData,
        companyId: company._id,
        joinedViaCode: companyCode,
        onboardingCompleted: false,
      });
      
      await employee.save();
      
      // Update audit with employee info
      auditRecord.employeeId = employee._id;
      await auditRecord.save();
      
      // Create employee wallet via Payman
      let walletResult: WalletCreationResult;
      try {
        const wallet = await paymanService.createEmployeeWallet(
          employee.name, 
          employee._id.toString(), 
          company.name
        );
        
        // Update employee with wallet info
        employee.paymanWalletId = wallet.id;
        employee.walletCreatedAt = new Date();
        employee.walletCreationSuccess = true;
        employee.onboardingCompleted = true;
        await employee.save();
        
        // Update company employee count
        company.employeeCount += 1;
        company.lastEmployeeJoinedAt = new Date();
        await company.save();
        
        // Update audit record
        auditRecord.walletCreationSuccess = true;
        auditRecord.walletId = wallet.id;
        auditRecord.completedAt = new Date();
        await auditRecord.save();
        
        walletResult = {
          success: true,
          walletId: wallet.id
        };
        
      } catch (walletError) {
        console.error('Failed to create employee wallet:', walletError);
        
        // Update employee with failure info
        employee.walletCreationSuccess = false;
        await employee.save();
        
        // Update audit record
        auditRecord.errorMessage = walletError.message;
        await auditRecord.save();
        
        walletResult = {
          success: false,
          error: walletError.message
        };
      }
      
      // Apply company policies automatically
      if (walletResult.success) {
        await this.applyCompanyPolicies(employee._id.toString(), companyCode);
      }
      
      return {
        employee: employee.toObject(),
        wallet: walletResult,
        auditId: auditRecord._id.toString()
      };
      
    } catch (error) {
      console.error('Error in onboardEmployeeWithWallet:', error);
      
      // Update audit record with error
      auditRecord.errorMessage = error.message;
      await auditRecord.save();
      
      throw new Error(`Failed to onboard employee: ${error.message}`);
    }
  }

  /**
   * Apply company spending policies to employee wallet
   */
  async applyCompanyPolicies(employeeId: string, companyCode: string): Promise<void> {
    try {
      const company = await Company.findOne({ joinCode: companyCode });
      const employee = await User.findById(employeeId);
      
      if (!company || !employee || !employee.paymanWalletId) {
        throw new Error('Invalid company, employee, or missing wallet');
      }
      
      // Apply company default policies to employee wallet
      await paymanService.setWalletPolicy(employee.paymanWalletId, {
        dailyLimit: employee.dailySpendingLimit || company.defaultDailyLimit,
        transactionLimit: company.defaultTransactionLimit,
        approvalThreshold: company.defaultApprovalThreshold,
        allowedCategories: company.allowedCategories
      });
      
    } catch (error) {
      console.error('Error applying company policies:', error);
      throw new Error(`Failed to apply policies: ${error.message}`);
    }
  }

  /**
   * Validate company code for signup form
   */
  async validateCompanyCode(companyCode: string): Promise<{ valid: boolean; companyName?: string; error?: string }> {
    try {
      const company = await Company.findOne({ joinCode: companyCode });
      
      if (!company) {
        return { valid: false, error: 'Invalid company code' };
      }
      
      return { 
        valid: true, 
        companyName: company.name 
      };
      
    } catch (error) {
      console.error('Error validating company code:', error);
      return { valid: false, error: 'Validation failed' };
    }
  }

  /**
   * Get company dashboard stats
   */
  async getCompanyStats(companyId: string) {
    try {
      const company = await Company.findById(companyId);
      const employees = await User.find({ companyId }).select('name email walletCreationSuccess createdAt');
      const auditRecords = await OnboardingAudit.find({ companyId }).sort({ createdAt: -1 }).limit(10);
      
      const successfulWallets = employees.filter(emp => emp.walletCreationSuccess).length;
      const failedWallets = employees.filter(emp => emp.walletCreationSuccess === false).length;
      
      return {
        company: company?.toObject(),
        employees: employees.map(emp => emp.toObject()),
        stats: {
          totalEmployees: employees.length,
          successfulWallets,
          failedWallets,
          walletSuccessRate: employees.length > 0 ? (successfulWallets / employees.length) * 100 : 0
        },
        recentOnboarding: auditRecords.map(audit => audit.toObject())
      };
      
    } catch (error) {
      console.error('Error getting company stats:', error);
      throw new Error(`Failed to get company stats: ${error.message}`);
    }
  }

  /**
   * Retry failed wallet creation
   */
  async retryWalletCreation(employeeId: string): Promise<WalletCreationResult> {
    try {
      const employee = await User.findById(employeeId).populate('companyId');
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      const auditRecord = await OnboardingAudit.findOne({ 
        employeeId, 
        walletCreationSuccess: false 
      });
      
      if (auditRecord) {
        auditRecord.retryCount += 1;
        auditRecord.lastRetryAt = new Date();
        await auditRecord.save();
      }
      
      // Attempt wallet creation again
      const wallet = await paymanService.createEmployeeWallet(
        employee.name, 
        employee._id.toString(), 
        (employee.companyId as any).name
      );
      
      // Update employee
      employee.paymanWalletId = wallet.id;
      employee.walletCreatedAt = new Date();
      employee.walletCreationSuccess = true;
      employee.onboardingCompleted = true;
      await employee.save();
      
      // Update audit
      if (auditRecord) {
        auditRecord.walletCreationSuccess = true;
        auditRecord.walletId = wallet.id;
        auditRecord.completedAt = new Date();
        await auditRecord.save();
      }
      
      return { success: true, walletId: wallet.id };
      
    } catch (error) {
      console.error('Error retrying wallet creation:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const walletService = new WalletService(); 