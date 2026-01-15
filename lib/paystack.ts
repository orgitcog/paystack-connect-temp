import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

export interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseUrl?: string;
}

export class PaystackClient {
  private client: AxiosInstance;
  public readonly secretKey: string;
  public readonly publicKey: string;

  constructor(config: PaystackConfig) {
    this.secretKey = config.secretKey;
    this.publicKey = config.publicKey;

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Make a request to the Paystack API
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error: any) {
      console.error('Paystack API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Subaccount API - equivalent to Stripe Connected Accounts
   */
  subaccounts = {
    /**
     * Create a new subaccount
     */
    create: async (params: {
      business_name: string;
      settlement_bank: string;
      account_number: string;
      percentage_charge: number;
      description?: string;
      primary_contact_email?: string;
      primary_contact_name?: string;
      primary_contact_phone?: string;
      metadata?: Record<string, any>;
    }) => {
      return this.request({
        method: 'POST',
        url: '/subaccount',
        data: params,
      });
    },

    /**
     * List subaccounts
     */
    list: async (params?: {
      perPage?: number;
      page?: number;
      from?: string;
      to?: string;
    }) => {
      return this.request({
        method: 'GET',
        url: '/subaccount',
        params,
      });
    },

    /**
     * Fetch a single subaccount
     */
    fetch: async (code: string) => {
      return this.request({
        method: 'GET',
        url: `/subaccount/${code}`,
      });
    },

    /**
     * Update a subaccount
     */
    update: async (
      code: string,
      params: {
        business_name?: string;
        settlement_bank?: string;
        account_number?: string;
        active?: boolean;
        percentage_charge?: number;
        description?: string;
        primary_contact_email?: string;
        primary_contact_name?: string;
        primary_contact_phone?: string;
        settlement_schedule?: string;
        metadata?: Record<string, any>;
      }
    ) => {
      return this.request({
        method: 'PUT',
        url: `/subaccount/${code}`,
        data: params,
      });
    },
  };

  /**
   * Transaction API
   */
  transactions = {
    /**
     * Initialize a transaction
     */
    initialize: async (params: {
      email: string;
      amount: number;
      currency?: string;
      reference?: string;
      callback_url?: string;
      plan?: string;
      invoice_limit?: number;
      metadata?: Record<string, any>;
      channels?: string[];
      split_code?: string;
      subaccount?: string;
      transaction_charge?: number;
      bearer?: 'account' | 'subaccount';
    }) => {
      return this.request({
        method: 'POST',
        url: '/transaction/initialize',
        data: params,
      });
    },

    /**
     * Verify a transaction
     */
    verify: async (reference: string) => {
      return this.request({
        method: 'GET',
        url: `/transaction/verify/${reference}`,
      });
    },

    /**
     * List transactions
     */
    list: async (params?: {
      perPage?: number;
      page?: number;
      from?: string;
      to?: string;
      customer?: number;
      status?: string;
      amount?: number;
    }) => {
      return this.request({
        method: 'GET',
        url: '/transaction',
        params,
      });
    },

    /**
     * Fetch a single transaction
     */
    fetch: async (id: string) => {
      return this.request({
        method: 'GET',
        url: `/transaction/${id}`,
      });
    },

    /**
     * Get transaction totals
     */
    totals: async (params?: {
      perPage?: number;
      page?: number;
      from?: string;
      to?: string;
    }) => {
      return this.request({
        method: 'GET',
        url: '/transaction/totals',
        params,
      });
    },
  };

  /**
   * Transfer API (equivalent to Stripe Payouts)
   */
  transfers = {
    /**
     * Initiate a transfer
     */
    initiate: async (params: {
      source: string;
      amount: number;
      recipient: string;
      reason?: string;
      currency?: string;
      reference?: string;
    }) => {
      return this.request({
        method: 'POST',
        url: '/transfer',
        data: params,
      });
    },

    /**
     * List transfers
     */
    list: async (params?: {
      perPage?: number;
      page?: number;
      from?: string;
      to?: string;
      customer?: string;
    }) => {
      return this.request({
        method: 'GET',
        url: '/transfer',
        params,
      });
    },

    /**
     * Fetch a single transfer
     */
    fetch: async (idOrCode: string) => {
      return this.request({
        method: 'GET',
        url: `/transfer/${idOrCode}`,
      });
    },

    /**
     * Finalize a transfer
     */
    finalize: async (params: {transfer_code: string; otp: string}) => {
      return this.request({
        method: 'POST',
        url: '/transfer/finalize_transfer',
        data: params,
      });
    },
  };

  /**
   * Transfer Recipients API
   */
  transferRecipients = {
    /**
     * Create a transfer recipient
     */
    create: async (params: {
      type: string;
      name: string;
      account_number: string;
      bank_code: string;
      description?: string;
      currency?: string;
      authorization_code?: string;
      metadata?: Record<string, any>;
    }) => {
      return this.request({
        method: 'POST',
        url: '/transferrecipient',
        data: params,
      });
    },

    /**
     * List transfer recipients
     */
    list: async (params?: {perPage?: number; page?: number}) => {
      return this.request({
        method: 'GET',
        url: '/transferrecipient',
        params,
      });
    },

    /**
     * Fetch a single transfer recipient
     */
    fetch: async (idOrCode: string) => {
      return this.request({
        method: 'GET',
        url: `/transferrecipient/${idOrCode}`,
      });
    },
  };

  /**
   * Balance API
   */
  balance = {
    /**
     * Fetch balance
     */
    fetch: async () => {
      return this.request({
        method: 'GET',
        url: '/balance',
      });
    },

    /**
     * Fetch balance ledger
     */
    ledger: async (params?: {
      perPage?: number;
      page?: number;
      from?: string;
      to?: string;
    }) => {
      return this.request({
        method: 'GET',
        url: '/balance/ledger',
        params,
      });
    },
  };

  /**
   * Customer API
   */
  customers = {
    /**
     * Create a customer
     */
    create: async (params: {
      email: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      metadata?: Record<string, any>;
    }) => {
      return this.request({
        method: 'POST',
        url: '/customer',
        data: params,
      });
    },

    /**
     * List customers
     */
    list: async (params?: {perPage?: number; page?: number}) => {
      return this.request({
        method: 'GET',
        url: '/customer',
        params,
      });
    },

    /**
     * Fetch a customer
     */
    fetch: async (emailOrCode: string) => {
      return this.request({
        method: 'GET',
        url: `/customer/${emailOrCode}`,
      });
    },

    /**
     * Update a customer
     */
    update: async (
      code: string,
      params: {
        first_name?: string;
        last_name?: string;
        phone?: string;
        metadata?: Record<string, any>;
      }
    ) => {
      return this.request({
        method: 'PUT',
        url: `/customer/${code}`,
        data: params,
      });
    },
  };

  /**
   * Verification API - for bank account and identity verification
   */
  verification = {
    /**
     * Resolve account number
     */
    resolveAccount: async (params: {
      account_number: string;
      bank_code: string;
    }) => {
      return this.request({
        method: 'GET',
        url: '/bank/resolve',
        params,
      });
    },

    /**
     * List banks
     */
    listBanks: async (params?: {
      country?: string;
      use_cursor?: boolean;
      perPage?: number;
      pay_with_bank_transfer?: boolean;
      pay_with_bank?: boolean;
      enabled_for_verification?: boolean;
    }) => {
      return this.request({
        method: 'GET',
        url: '/bank',
        params,
      });
    },
  };
}

// Initialize Paystack client with environment variables
export const paystack = new PaystackClient({
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
});
