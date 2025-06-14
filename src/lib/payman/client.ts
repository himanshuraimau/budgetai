import { PaymanClient } from "@paymanai/payman-ts";

// Initialize the Payman client with credentials
const paymanClient = PaymanClient.withCredentials({
  clientId: process.env.PAYMAN_CLIENT_ID || "",
  clientSecret: process.env.PAYMAN_CLIENT_SECRET || "",
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
   * Get the main wallet associated with our app credentials
   */
  async getMainWallet(): Promise<PaymanWallet> {
    try {
      const response = await this.client.ask("what's my wallet balance?");
      return this.parseWalletResponse(response);
    } catch (error) {
      console.error('Error getting main wallet:', error);
      throw new Error(`Failed to get main wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a test payee for an employee
   */
  async createEmployeePayee(employeeName: string, employeeId: string, email: string): Promise<PayeeInfo> {
    try {
      const response = await this.client.ask(
        `create a test payee named "${employeeName}" with email ${email}`,
        {
          metadata: {
            employeeId,
            purpose: 'employee_reimbursement',
            type: 'test_payee'
          }
        }
      );
      return this.parsePayeeResponse(response);
    } catch (error) {
      console.error('Error creating employee payee:', error);
      throw new Error(`Failed to create employee payee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all wallets for monitoring
   */
  async listAllWallets(): Promise<PaymanWallet[]> {
    try {
      const response = await this.client.ask("list all wallets");
      return this.parseWalletsListResponse(response);
    } catch (error) {
      console.error('Error listing wallets:', error);
      throw new Error(`Failed to list wallets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get wallet balance and details
   */
  async getWalletDetails(walletId?: string): Promise<PaymanWallet> {
    try {
      const query = walletId ? 
        `Get details and balance for wallet ${walletId}` : 
        "what's my wallet balance?";
      
      const response = await this.client.ask(query);
      return this.parseWalletResponse(response);
    } catch (error) {
      console.error('Error getting wallet details:', error);
      throw new Error(`Failed to get wallet details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a payee for vendor payments
   */
  async createPayee(name: string, email: string, type: 'test' | 'email' = 'test'): Promise<PayeeInfo> {
    try {
      const response = await this.client.ask(
        `create a ${type} payee named "${name}" with email ${email}`
      );
      return this.parsePayeeResponse(response);
    } catch (error) {
      console.error('Error creating payee:', error);
      throw new Error(`Failed to create payee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send payment from main wallet to payee
   */
  async sendPayment(
toPayeeId: string, id: string, amount: number, description: string, requestId?: string  ): Promise<any> {
    try {
      const response = await this.client.ask(
        `send $${amount} to payee ${toPayeeId} for ${description}`,
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
      throw new Error(`Failed to send payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all payees for dropdown/selection
   */
  async listPayees(): Promise<PayeeInfo[]> {
    try {
      const response = await this.client.ask("list all payees");
      return this.parsePayeesListResponse(response);
    } catch (error) {
      console.error('Error listing payees:', error);
      throw new Error(`Failed to list payees: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods to parse Payman responses
  private parseWalletResponse(response: any): PaymanWallet {
    // Parse the natural language response from Payman
    return {
      id: response.walletId || response.id || 'main-wallet',
      type: response.type || 'TSD',
      balance: response.balance || 0,
      name: response.name || 'Main Wallet',
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
      type: response.type || 'test',
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