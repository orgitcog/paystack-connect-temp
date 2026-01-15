import {useState, useCallback, useEffect} from 'react';

export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount?: number;
  currency?: string;
  reference?: string;
  onSuccess?: (response: any) => void;
  onClose?: () => void;
}

/**
 * Hook for integrating Paystack payments
 * This provides a simpler alternative to Stripe Connect's embedded components
 */
export const usePaystack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Paystack inline script
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load Paystack script');
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  /**
   * Initialize a payment with Paystack
   */
  const initializePayment = useCallback(
    async (config: PaystackConfig) => {
      if (!isScriptLoaded) {
        setError('Paystack script not loaded yet');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const handler = window.PaystackPop.setup({
          key: config.publicKey,
          email: config.email,
          amount: config.amount,
          currency: config.currency || 'NGN',
          ref: config.reference || `${Date.now()}`,
          onClose: () => {
            setIsLoading(false);
            if (config.onClose) {
              config.onClose();
            }
          },
          callback: (response: any) => {
            setIsLoading(false);
            if (config.onSuccess) {
              config.onSuccess(response);
            }
          },
        });

        handler.openIframe();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment');
        setIsLoading(false);
      }
    },
    [isScriptLoaded]
  );

  /**
   * Initialize a transaction with server-side setup
   */
  const initializeTransaction = useCallback(
    async (params: {
      email: string;
      amount: number;
      currency?: string;
      metadata?: Record<string, any>;
      subaccount?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/paystack/transaction/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to initialize transaction');
        }

        setIsLoading(false);
        return data;
      } catch (err: any) {
        setError(err.message || 'Failed to initialize transaction');
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  /**
   * Create a subaccount
   */
  const createSubaccount = useCallback(
    async (params: {
      business_name: string;
      settlement_bank: string;
      account_number: string;
      percentage_charge?: number;
      description?: string;
      primary_contact_email?: string;
      primary_contact_name?: string;
      primary_contact_phone?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/paystack/subaccount/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to create subaccount');
        }

        setIsLoading(false);
        return data.subaccount;
      } catch (err: any) {
        setError(err.message || 'Failed to create subaccount');
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  /**
   * List transactions
   */
  const listTransactions = useCallback(
    async (params?: {
      perPage?: number;
      page?: number;
      from?: string;
      to?: string;
      status?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.from) queryParams.append('from', params.from);
        if (params?.to) queryParams.append('to', params.to);
        if (params?.status) queryParams.append('status', params.status);

        const response = await fetch(
          `/api/paystack/transaction/list?${queryParams.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to list transactions');
        }

        setIsLoading(false);
        return data.data;
      } catch (err: any) {
        setError(err.message || 'Failed to list transactions');
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    isLoading,
    error,
    isScriptLoaded,
    initializePayment,
    initializeTransaction,
    createSubaccount,
    listTransactions,
  };
};

// Extend Window interface for PaystackPop
declare global {
  interface Window {
    PaystackPop?: any;
  }
}
