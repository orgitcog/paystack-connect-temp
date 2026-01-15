# Paystack Connect Integration Guide

This guide explains how to use the Paystack integration in this platform as an alternative to Stripe Connect.

## Overview

Paystack is Africa's leading payment platform, similar to Stripe but optimized for African markets (Nigeria, Ghana, South Africa). This integration provides Connect-like functionality using Paystack's Subaccounts API.

## Key Concepts

### Subaccounts (Equivalent to Stripe Connected Accounts)

Paystack Subaccounts allow you to split payments between your platform and merchants. Each merchant gets their own subaccount with:

- Separate settlement account
- Configurable fee split
- Independent transaction tracking
- Automated settlements

### Architecture

```
Platform Account (Main)
├── Subaccount 1 (Merchant A)
├── Subaccount 2 (Merchant B)
└── Subaccount 3 (Merchant C)
```

## Getting Started

### 1. Setup

Get your API keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer):

```bash
PAYSTACK_SECRET_KEY="sk_test_xxxxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxxxx"
```

### 2. Create a Subaccount

Use the `PaystackOnboarding` component or API endpoint:

```typescript
// Using the hook
import {usePaystack} from '@/app/hooks/usePaystack';

const {createSubaccount} = usePaystack();

await createSubaccount({
  business_name: 'Merchant Business',
  settlement_bank: '044', // Bank code
  account_number: '0690000031',
  percentage_charge: 10, // Platform takes 10%
  description: 'Merchant subaccount',
  primary_contact_email: 'merchant@example.com',
});
```

```bash
# Using the API directly
curl -X POST http://localhost:3000/api/paystack/subaccount/create \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Merchant Business",
    "settlement_bank": "044",
    "account_number": "0690000031",
    "percentage_charge": 10
  }'
```

### 3. Initialize Transactions

```typescript
import {usePaystack} from '@/app/hooks/usePaystack';

const {initializeTransaction} = usePaystack();

const result = await initializeTransaction({
  email: 'customer@example.com',
  amount: 1000000, // Amount in kobo (NGN 10,000)
  currency: 'NGN',
  subaccount: 'ACCT_xxxxx', // Merchant's subaccount code
});

// Redirect customer to authorization_url
window.location.href = result.authorization_url;
```

### 4. Handle Webhooks

Paystack sends webhook events to `/api/paystack/webhooks`. Set this up in your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer):

```
https://yourdomain.com/api/paystack/webhooks
```

Supported events:

- `charge.success` - Payment successful
- `transfer.success` - Payout successful
- `transfer.failed` - Payout failed
- `transfer.reversed` - Payout reversed
- And more...

## API Reference

### Subaccounts

#### Create Subaccount

```typescript
POST /api/paystack/subaccount/create
{
  "business_name": "Business Name",
  "settlement_bank": "044",
  "account_number": "0690000031",
  "percentage_charge": 10,
  "description": "Optional description"
}
```

### Transactions

#### Initialize Transaction

```typescript
POST /api/paystack/transaction/initialize
{
  "email": "customer@example.com",
  "amount": 1000000, // kobo
  "currency": "NGN",
  "subaccount": "ACCT_xxxxx"
}
```

#### List Transactions

```typescript
GET /api/paystack/transaction/list?page=1&perPage=20
```

### Transfers (Payouts)

#### Initiate Transfer

```typescript
POST /api/paystack/transfer/initiate
{
  "source": "balance",
  "amount": 500000, // kobo
  "recipient": "RCP_xxxxx",
  "reason": "Payout for sales"
}
```

### Balance

#### Get Balance

```typescript
GET / api / paystack / balance;
```

### Banks

#### List Banks

```typescript
GET /api/paystack/banks?country=nigeria
```

#### Verify Account

```typescript
GET /api/paystack/verify_account?account_number=0690000031&bank_code=044
```

## React Components

### PaystackOnboarding

Modal component for merchant onboarding:

```typescript
import PaystackOnboarding from '@/app/components/PaystackOnboarding';

<PaystackOnboarding
  open={showOnboarding}
  onOpenChange={setShowOnboarding}
  onComplete={() => {
    console.log('Subaccount created!');
  }}
/>
```

### PaystackTransactionsList

Display transactions with pagination:

```typescript
import PaystackTransactionsList from '@/app/components/PaystackTransactionsList';

<PaystackTransactionsList />
```

## React Hook

### usePaystack

Main hook for Paystack operations:

```typescript
import {usePaystack} from '@/app/hooks/usePaystack';

const {
  isLoading,
  error,
  initializeTransaction,
  createSubaccount,
  listTransactions,
} = usePaystack();
```

## Currency & Amount Format

Paystack uses the smallest currency unit:

- **NGN (Nigerian Naira)**: Amount in kobo (1 Naira = 100 kobo)
- **GHS (Ghanaian Cedi)**: Amount in pesewas (1 Cedi = 100 pesewas)
- **ZAR (South African Rand)**: Amount in cents (1 Rand = 100 cents)

Example:

```typescript
// NGN 10,000.00 = 1,000,000 kobo
amount: 1000000;
```

## Testing

Paystack provides test API keys that work with test bank accounts:

### Test Bank Details

- **Bank**: Access Bank (044)
- **Account Number**: 0690000031
- **Account Name**: Test Account

### Test Cards

- **Card Number**: 4084 0840 8408 4081
- **Expiry**: Any future date
- **CVV**: 408
- **PIN**: 0000
- **OTP**: 123456

## Migration from Stripe

| Stripe Concept         | Paystack Equivalent        | Notes                                |
| ---------------------- | -------------------------- | ------------------------------------ |
| Connected Accounts     | Subaccounts                | Similar split payment functionality  |
| Account ID (acct_xxx)  | Subaccount Code (ACCT_xxx) | Both are unique identifiers          |
| Charges/PaymentIntents | Transactions               | Initialize → Authorize → Charge flow |
| Payouts                | Transfers                  | Both send money to bank accounts     |
| Balance                | Balance                    | Both track available funds           |
| Account Sessions       | N/A                        | Paystack uses direct API calls       |
| Embedded Components    | Custom UI                  | Build your own UI components         |

## Best Practices

1. **Always verify bank accounts** before creating subaccounts
2. **Use webhooks** for asynchronous operations (transfers, charges)
3. **Store subaccount codes** in your database linked to user accounts
4. **Handle errors gracefully** - Paystack has rate limits
5. **Use test mode** during development
6. **Validate amounts** are in smallest currency unit (kobo/pesewas/cents)

## Common Issues

### Issue: "Invalid bank code"

**Solution**: Get the correct bank code using the `/api/paystack/banks` endpoint

### Issue: "Account verification failed"

**Solution**: Ensure the account number is exactly 10 digits and the bank code is correct

### Issue: "Insufficient balance"

**Solution**: Ensure the platform account has sufficient balance for transfers

### Issue: "Webhook signature mismatch"

**Solution**: Verify that `PAYSTACK_SECRET_KEY` in your environment matches the one used in webhook signature verification

## Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)
- [Paystack Dashboard](https://dashboard.paystack.com)
- [PaystackOSS GitHub](https://github.com/PaystackOSS)
- [Postman Collection](./postman-paystack.yaml)

## Support

For Paystack-specific issues:

- Email: support@paystack.com
- Twitter: [@paystack](https://twitter.com/paystack)
- Community: [Paystack Slack](https://paystack-community.slack.com)

For integration issues:

- Check this documentation
- Review the [paystack-oss.md](./paystack-oss.md) file
- Open an issue in this repository
