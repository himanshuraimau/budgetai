import { PaymanClient } from "@paymanai/payman-ts";

// Initialize the Payman client with credentials
const paymanClient = PaymanClient.withClientCredentials({
  clientId: process.env.PAYMAN_CLIENT_ID || "pm-test-pnIQljqD50H3GkdezYbwWF2n",
  clientSecret: process.env.PAYMAN_CLIENT_SECRET || "4cBW8wNd89UF3HkogC3wSzLhGSfBzRaf50F5q1wqXfLcptH6FxtXTGT8AEJbkDpi",
});

export interface PaymanWallet {
  id: string;
  type: 'USD' | 'USDC' | 'TSD';
  balance: number;
  name: string;
  policies?: PaymentPolicy[];
}

export interface PaymentPolicy {
  dailyLimit: number;
  transactionLimit: number;
  approvalThreshold: number;
  allowedCategories: string[];
}

export interface PayeeInfo {
  id: string;
  name: string;
  type: string;
  email?: string;
  bankAccount?: string;
}

export class PaymanService {
  private client = paymanClient;

  /**
   * Create a USD wallet for company operations
   */
  async createCompanyWallet(companyName: string, companyId: string): Promise<PaymanWallet> {
    try {
      const response = await this.client.ask(
        `Create a USD wallet named "Company-${companyName}" for business operations`,
        {
          metadata: {
            companyId,
            walletType: 'company',
            purpose: 'business_operations'
          }
        }
      );

      return this.parseWalletResponse(response);
    } catch (error) {
      console.error('Error creating company wallet:', error);
      throw new Error(`Failed to create company wallet: ${error.message}`);
    }
  }

  /**
   * Create a TSD wallet for employee (test funds for development)
   */
  async createEmployeeWallet(employeeName: string, employeeId: string, companyName: string): Promise<PaymanWallet> {
    try {
      const response = await this.client.ask(
        `Create a TSD wallet named "Employee-${employeeName}" for ${companyName}`,
        {
          metadata: {
            employeeId,
            walletType: 'employee',
            purpose: 'expense_management',
            company: companyName
          }
        }
      );

      return this.parseWalletResponse(response);
    } catch (error) {
      console.error('Error creating employee wallet:', error);
      throw new Error(`Failed to create employee wallet: ${error.message}`);
    }
  }

  /**
   * List all wallets for monitoring
   */
  async listAllWallets(): Promise<PaymanWallet[]> {
    try {
      const response = await this.client.ask("List all wallets and their balances");
      return this.parseWalletsListResponse(response);
    } catch (error) {
      console.error('Error listing wallets:', error);
      throw new Error(`Failed to list wallets: ${error.message}`);
    }
  }

  /**
   * Get wallet balance and details
   */
  async getWalletDetails(walletId: string): Promise<PaymanWallet> {
    try {
      const response = await this.client.ask(
        `Get details and balance for wallet ${walletId}`
      );
      return this.parseWalletResponse(response);
    } catch (error) {
      console.error('Error getting wallet details:', error);
      throw new Error(`Failed to get wallet details: ${error.message}`);
    }
  }

  /**
   * Create a payee for vendor payments
   */
  async createPayee(name: string, email: string, type: 'bank' | 'email' | 'test' = 'email'): Promise<PayeeInfo> {
    try {
      const response = await this.client.ask(
        `Create a payee named "${name}" with email ${email} of type ${type}`
      );
      return this.parsePayeeResponse(response);
    } catch (error) {
      console.error('Error creating payee:', error);
      throw new Error(`Failed to create payee: ${error.message}`);
    }
  }

  /**
   * Send payment from company wallet to employee/vendor
   */
  async sendPayment(
    fromWalletId: string, 
    toPayeeId: string, 
    amount: number, 
    description: string,
    requestId?: string
  ): Promise<any> {
    try {
      const response = await this.client.ask(
        `Send $${amount} from wallet ${fromWalletId} to payee ${toPayeeId} for ${description}`,
        {
          metadata: {
            requestId,
            amount,
            description,
            timestamp: new Date().toISOString()
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw new Error(`Failed to send payment: ${error.message}`);
    }
  }

  /**
   * Set up wallet policies for spending limits
   */
  async setWalletPolicy(
    walletId: string, 
    policy: PaymentPolicy
  ): Promise<void> {
    try {
      await this.client.ask(
        `Set policy for wallet ${walletId}: daily limit $${policy.dailyLimit}, transaction limit $${policy.transactionLimit}, approval threshold $${policy.approvalThreshold}`
      );
    } catch (error) {
      console.error('Error setting wallet policy:', error);
      throw new Error(`Failed to set wallet policy: ${error.message}`);
    }
  }

  /**
   * List all payees for dropdown/selection
   */
  async listPayees(): Promise<PayeeInfo[]> {
    try {
      const response = await this.client.ask("List all payees");
      return this.parsePayeesListResponse(response);
    } catch (error) {
      console.error('Error listing payees:', error);
      throw new Error(`Failed to list payees: ${error.message}`);
    }
  }

  // Helper methods to parse Payman responses
  private parseWalletResponse(response: any): PaymanWallet {
    // Parse the natural language response from Payman
    // This is a simplified parser - you may need to adjust based on actual Payman responses
    return {
      id: response.walletId || response.id || 'unknown',
      type: response.type || 'TSD',
      balance: response.balance || 0,
      name: response.name || 'Wallet',
      policies: response.policies || []
    };
  }

  private parseWalletsListResponse(response: any): PaymanWallet[] {
    // Parse list of wallets from Payman response
    if (Array.isArray(response)) {
      return response.map(wallet => this.parseWalletResponse(wallet));
    }
    return [];
  }

  private parsePayeeResponse(response: any): PayeeInfo {
    return {
      id: response.payeeId || response.id || 'unknown',
      name: response.name || 'Unknown',
      type: response.type || 'email',
      email: response.email,
      bankAccount: response.bankAccount
    };
  }

  private parsePayeesListResponse(response: any): PayeeInfo[] {
    if (Array.isArray(response)) {
      return response.map(payee => this.parsePayeeResponse(payee));
    }
    return [];
  }
}

// Export singleton instance
export const paymanService = new PaymanService();

// Export client for direct access if needed
export { paymanClient }; 