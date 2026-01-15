'use client';

import * as React from 'react';
import {useState} from 'react';
import PaystackBalance from '@/app/components/PaystackBalance';
import PaystackTransactionsList from '@/app/components/PaystackTransactionsList';
import PaystackOnboarding from '@/app/components/PaystackOnboarding';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Plus, CreditCard, Send} from 'lucide-react';

export default function PaystackDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paystack Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Manage your Paystack subaccounts and transactions
          </p>
        </div>
        <Button onClick={() => setShowOnboarding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Subaccount
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <PaystackBalance />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common Paystack operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Initialize Transaction
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Send className="mr-2 h-4 w-4" />
              Create Transfer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn about Paystack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="https://paystack.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              → View Documentation
            </a>
            <a
              href="https://dashboard.paystack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              → Open Dashboard
            </a>
            <a
              href="/PAYSTACK_GUIDE.md"
              className="block text-sm text-blue-600 hover:underline"
            >
              → Integration Guide
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="comparison">Stripe Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <PaystackTransactionsList />
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transfers (Coming Soon)</CardTitle>
              <CardDescription>
                View and manage your Paystack transfers/payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Transfer functionality will be available here. Use the API
                endpoint{' '}
                <code className="rounded bg-gray-100 px-2 py-1">
                  /api/paystack/transfer/initiate
                </code>
                to create transfers programmatically.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paystack vs Stripe Connect</CardTitle>
              <CardDescription>
                Key differences and migration notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">API Equivalents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                      <div className="font-medium">Feature</div>
                      <div className="font-medium">Stripe</div>
                      <div className="font-medium">Paystack</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>Merchant Accounts</div>
                      <div>Connected Accounts</div>
                      <div>Subaccounts</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>Process Payments</div>
                      <div>Charges API</div>
                      <div>Transactions API</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>Send Payouts</div>
                      <div>Payouts API</div>
                      <div>Transfers API</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>UI Components</div>
                      <div>Embedded Components</div>
                      <div>Custom UI (this app)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Market Coverage</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • <strong>Stripe:</strong> Global (US, Europe, Asia, etc.)
                    </li>
                    <li>
                      • <strong>Paystack:</strong> Africa (Nigeria, Ghana, South
                      Africa)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Key Differences</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • Paystack doesn&apos;t have embedded UI components -
                      custom UI required
                    </li>
                    <li>
                      • Paystack uses kobo/pesewas/cents (smallest currency
                      unit)
                    </li>
                    <li>• Different bank verification process in Africa</li>
                    <li>
                      • Simpler onboarding (just bank account details needed)
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 text-sm font-semibold">Migration Tip</h4>
                  <p className="text-sm text-gray-700">
                    This platform demonstrates how to build similar
                    functionality to Stripe Connect using Paystack. The custom
                    components in this app (PaystackOnboarding,
                    PaystackTransactionsList) replace Stripe&apos;s embedded
                    components with similar UX.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Onboarding Modal */}
      <PaystackOnboarding
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          // Refresh the page or show success message
        }}
      />
    </div>
  );
}
