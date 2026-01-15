'use client';

import * as React from 'react';
import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Loader2, RefreshCw, Wallet} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface BalanceData {
  currency: string;
  balance: number;
}

export default function PaystackBalance() {
  const [balances, setBalances] = useState<BalanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/paystack/balance');
      const data = await response.json();

      if (data.success && data.balance) {
        // Paystack returns balance as an array of currency objects
        setBalances(data.balance);
      } else {
        setError(data.error || 'Failed to load balance');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load balance');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    // Convert from kobo/pesewas/cents to main currency unit
    const mainAmount = amount / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'NGN',
      minimumFractionDigits: 2,
    }).format(mainAmount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <Button
              onClick={fetchBalance}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Available Balance
          </CardTitle>
          <Button
            onClick={fetchBalance}
            variant="ghost"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No balance information available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {balance.currency}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatAmount(balance.balance, balance.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
