# Stripe Connect Embedded Components Demo

This is a configurable demo platform showcasing [Stripe Connect](https://stripe.com/connect) and [Stripe Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components). The platform can be customized for any vertical (pet grooming, fitness studios, bookstores, etc.) using zone configuration files.

**Default Demo:** FurEver - a vertical SaaS grooming platform for pet salons. See a live version on [furever.dev](https://furever.dev).

<img src="public/cover.png">

## 🎯 Zone Configuration System

This repository includes a powerful **zone configuration system** that allows you to adapt the entire platform for different verticals without code changes. Simply configure:

- **Branding** (logos, colors, taglines)
- **Terminology** (customize terms like "salon" → "studio", "pet" → "member")
- **Features** (customize feature descriptions)
- **Content** (testimonials, CTAs, etc.)

**📖 See [ZONE_CONFIG.md](./ZONE_CONFIG.md) for detailed configuration instructions.**

### Quick Start with Zone Configuration

1. Choose or create a zone configuration file:

   ```bash
   cp zone.example.json my-zone.json
   # Edit my-zone.json for your vertical
   ```

2. Set the configuration path in `.env`:

   ```bash
   ZONE_CONFIG_PATH="my-zone.json"
   ```

3. Run the application (see installation instructions below)

## Features

This platform showcases the integration between a platform's website, [Stripe Connect](https://stripe.com/connect), and [Stripe Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components). Users sign up within the platform's website and through the process, a corresponding Stripe unified account is created with the following configuration:

- Stripe owns loss liability
- Platform owns pricing
- Stripe is onboarding owner
- The connected account has no access to the Stripe dashboard

The user will then onboard with Stripe via embedded onboarding. Thereafter, Connect embedded components will provide the UI surfaces for account management and dashboard UI elements with just a few lines of code. The demo website also uses the Stripe API to create test payments and payouts. This app also contains a basic authentication system.

This demo makes use of the following [Connect embedded components](https://docs.stripe.com/connect/supported-embedded-components):

- `<ConnectOnboarding />` enables an embedded onboarding experience without redirecting users to Stripe hosted onboarding.
- `<ConnectPayments />` provides a list to display Stripe payments, refunds, and disputes. This also includes handling list filtering, pagination, and CSV exports.
- `<ConnectPayouts />` provides a list to display Stripe payouts and balance. This also includes handling list filtering, pagination, and CSV exports.
- `<ConnectAccountManagement />` allows users to edit their Stripe account settings without navigating to the Stripe dashboard.
- `<ConnectNotificationBanner />` displays a list of current and future risk requirements an account needs to resolve.
- `<ConnectDocuments />` displays a list of tax invoice documents.
- `<ConnectTaxSettings />` allows users to [set up Stripe Tax](https://docs.stripe.com/tax/set-up).
- `<ConnectTaxRegistrations />` allows users to control their tax compliance settings.

Additionally, the following preview components are also used:

- `<ConnectCapitalOverview />` **preview** allows users to check their eligibility for financing, get an overview of their in-progress financing, and access the reporting page to review paydown transactions.
- `<ConnectFinancialAccount />` **preview** renders a view of an individual [Financial Account](https://docs.stripe.com/api/treasury/financial_accounts)
- `<ConnectFinancialAccountTransactions />` **preview** provides a list of transactions associated with a financial account.
- `<ConnectIssuingCardsList />` **preview** provides a list of all the cards issued.

### Architecture

The web application is implemented as as full-stack application using Express, React, Typescript, and Material UI.

This demo is built with

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

To integrate Stripe Connect embedded components, check out our [documentation](https://docs.stripe.com/connect/get-started-connect-embedded-components).

1. [`hooks/useConnect.ts`](client/hooks/Connect.tsx) shows the client side integration with Connect embedded components.
2. [`api/account_session/route.ts`](server/routes/stripe.ts) shows the server request to `v1/account_sessions`.

## Requirements

You'll need either a Stripe account or a Paystack account to manage onboarding and payments:

### Stripe (Original Platform)
- [Sign up for free](https://dashboard.stripe.com/register), then [enable Connect](https://dashboard.stripe.com/account/applications/settings) by filling in your Connect settings.
- Fill in the necessary information in the **Branding** section in [Connect settings](https://dashboard.stripe.com/test/settings/connect).

### Paystack (Africa Platform)
- [Sign up for Paystack](https://dashboard.paystack.com/#/signup)
- Get your API keys from [Settings > API Keys & Webhooks](https://dashboard.paystack.com/#/settings/developer)
- Enable Subaccounts feature for Connect-like functionality

### Getting started

Install dependencies using npm (or yarn):

```
yarn
```

Copy the environment file and add your own API keys:

```
cp .env.example .env
```

For **Stripe**, add your [Stripe API keys](https://dashboard.stripe.com/account/apikeys):
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`

For **Paystack**, add your [Paystack API keys](https://dashboard.paystack.com/#/settings/developer):
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`

Install MongoDB Community Edition. Refer to the [official documentation](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/). Then, run MongoDB:

```
brew tap mongodb/brew && brew update
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Run the app:

```
yarn dev
```

Go to `http://localhost:{process.env.PORT}` in your browser to start using the app.

To test events sent to your event handler, you can run this command in a separate terminal:

**For Stripe:**
```
stripe listen --forward-to localhost:3000/api/webhooks
```

Then, trigger a test event with:
```
stripe trigger payment_intent.succeeded
```

**For Paystack:**
Set up webhooks in your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer) pointing to:
```
http://localhost:3000/api/paystack/webhooks
```

## Paystack vs Stripe Connect Comparison

This platform now supports both Stripe Connect and Paystack, providing a seamless migration path for businesses expanding to Africa:

### Key Differences

| Feature | Stripe Connect | Paystack |
|---------|---------------|----------|
| Connected Accounts | Yes (Connected Accounts API) | Yes (Subaccounts API) |
| Embedded Components | Yes (UI components) | No (custom UI required) |
| Markets | US, Europe, Global | Nigeria, Ghana, South Africa |
| Dashboard Access | Configurable | Via Paystack Dashboard |
| Onboarding | Embedded onboarding | Custom bank verification |
| Split Payments | Yes | Yes (via subaccounts) |

### API Equivalents

| Stripe | Paystack | Purpose |
|--------|----------|---------|
| Connected Accounts | Subaccounts | Manage merchant accounts |
| Charges | Transactions | Process payments |
| Payouts | Transfers | Send money to accounts |
| Account Sessions | N/A | Managed via API calls |

### Using Paystack

1. **Create a Subaccount**: Use the `PaystackOnboarding` component or API
2. **Initialize Transactions**: Use the `usePaystack` hook
3. **View Transactions**: Use the `PaystackTransactionsList` component
4. **Process Transfers**: Use the Paystack API for payouts

See [paystack-oss.md](./paystack-oss.md) for more Paystack resources and documentation.

## Preview components

By default, preview components are turned off in this repository. If you'd like to enable them, make sure to request access to them for your platforms in [the Stripe doc site](https://docs.stripe.com/connect/supported-embedded-components). You can then add this variable to the .env file to activate these components.

```
NEXT_PUBLIC_ENABLE_PREVIEW_COMPONENTS=1
```
