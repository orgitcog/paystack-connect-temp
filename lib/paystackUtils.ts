import {paystack} from './paystack';

/**
 * Utility functions for Paystack subaccount management
 */

export interface CreateSubaccountParams {
  email: string;
  businessName: string;
  settlementBank?: string;
  accountNumber?: string;
  percentageCharge?: number;
  description?: string;
}

/**
 * Create a Paystack subaccount with default test values
 * This is similar to Stripe's test account creation in the auth flow
 */
export async function createPaystackSubaccount(
  params: CreateSubaccountParams
): Promise<any> {
  try {
    // For development/testing, use default bank details
    // In production, these should come from user input
    const response: any = await paystack.subaccounts.create({
      business_name: params.businessName,
      settlement_bank: params.settlementBank || '044', // Access Bank Nigeria (for testing)
      account_number: params.accountNumber || '0690000031', // Test account number
      percentage_charge: params.percentageCharge || 0,
      description: params.description || 'Platform subaccount',
      primary_contact_email: params.email,
    });

    if (response.status && response.data) {
      return {
        success: true,
        subaccountCode: response.data.subaccount_code,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.message || 'Failed to create subaccount',
      };
    }
  } catch (error: any) {
    console.error('Error creating Paystack subaccount:', error);
    return {
      success: false,
      error: error.message || 'Failed to create subaccount',
    };
  }
}

/**
 * Get subaccount information
 */
export async function getPaystackSubaccount(
  subaccountCode: string
): Promise<any> {
  try {
    const response: any = await paystack.subaccounts.fetch(subaccountCode);

    if (response.status && response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.message || 'Failed to fetch subaccount',
      };
    }
  } catch (error: any) {
    console.error('Error fetching Paystack subaccount:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch subaccount',
    };
  }
}

/**
 * Update subaccount information
 */
export async function updatePaystackSubaccount(
  subaccountCode: string,
  updates: {
    business_name?: string;
    settlement_bank?: string;
    account_number?: string;
    percentage_charge?: number;
    description?: string;
  }
): Promise<any> {
  try {
    const response: any = await paystack.subaccounts.update(
      subaccountCode,
      updates
    );

    if (response.status && response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.message || 'Failed to update subaccount',
      };
    }
  } catch (error: any) {
    console.error('Error updating Paystack subaccount:', error);
    return {
      success: false,
      error: error.message || 'Failed to update subaccount',
    };
  }
}

/**
 * Verify bank account details
 */
export async function verifyBankAccount(
  accountNumber: string,
  bankCode: string
): Promise<any> {
  try {
    const response: any = await paystack.verification.resolveAccount({
      account_number: accountNumber,
      bank_code: bankCode,
    });

    if (response.status && response.data) {
      return {
        success: true,
        accountName: response.data.account_name,
        accountNumber: response.data.account_number,
      };
    } else {
      return {
        success: false,
        error: response.message || 'Failed to verify account',
      };
    }
  } catch (error: any) {
    console.error('Error verifying bank account:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify account',
    };
  }
}

/**
 * Get list of Nigerian banks
 */
export async function getNigerianBanks(): Promise<any> {
  try {
    const response: any = await paystack.verification.listBanks({
      country: 'nigeria',
      perPage: 100,
    });

    if (response.status && response.data) {
      return {
        success: true,
        banks: response.data,
      };
    } else {
      return {
        success: false,
        error: response.message || 'Failed to fetch banks',
      };
    }
  } catch (error: any) {
    console.error('Error fetching banks:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch banks',
    };
  }
}
