'use client';

import * as React from 'react';
import {useState, useEffect} from 'react';
import {usePaystack} from '@/app/hooks/usePaystack';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Loader2, RefreshCw} from 'lucide-react';

interface Transaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  customer: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
  channel: string;
}

export default function PaystackTransactionsList() {
  const {listTransactions, isLoading} = usePaystack();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setError(null);
      const data = await listTransactions({
        perPage: 20,
        page: page,
      });
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    // Convert from kobo/pesewas/cents to main currency unit
    const mainAmount = amount / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'NGN',
    }).format(mainAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Button
          onClick={fetchTransactions}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoading && transactions.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">No transactions yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Transactions will appear here once you start accepting payments
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.reference}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transaction.customer.first_name ||
                            transaction.customer.last_name
                            ? `${transaction.customer.first_name || ''} ${transaction.customer.last_name || ''}`.trim()
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatAmount(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(transaction.status)}
                        variant="outline"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">
                      {transaction.channel}
                    </TableCell>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={transactions.length < 20 || isLoading}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
