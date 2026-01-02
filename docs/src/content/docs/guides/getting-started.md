---
title: Getting Started
description: Learn how to install and configure the Voltax SDK for Node.js.
---

import { Tabs, TabItem, Aside, Steps } from '@astrojs/starlight/components';

Voltax is a unified payment SDK that simplifies integrating multiple African payment gateways (Paystack, Flutterwave, Hubtel) into a single, consistent API. Build faster, switch providers easily, and maintain less code.

## Features

- 🛡 **Strictly Typed**: Built with TypeScript + Zod for runtime validation
- 🔗 **Standardized API**: One interface (`VoltaxProvider`) for all gateways
- 🔄 **Adapter Pattern**: Swap providers without rewriting business logic
- ⚡ **Lightweight**: Tree-shakeable, ESM & CJS support
- 🔒 **Secure**: No hardcoded keys, enforced validation checks

## Prerequisites

Before you begin, make sure you have:
- Node.js 18 or later
- npm, pnpm, or yarn package manager
- API credentials from at least one supported payment provider

## Installation

Install the Voltax SDK using your preferred package manager.

<Tabs>
  <TabItem label="npm">
  ```bash
  npm install voltax-node
  ```
  </TabItem>
  <TabItem label="pnpm">
  ```bash
  pnpm add voltax-node
  ```
  </TabItem>
  <TabItem label="yarn">
  ```bash
  yarn add voltax-node
  ```
  </TabItem>
</Tabs>

## Quick Start

<Steps>

1. **Import the SDK**

   You can import the `Voltax` class either as a default export or named export:

   ```typescript
   // Default import
   import Voltax from 'voltax-node';

   // Or named import
   import { Voltax } from 'voltax-node';
   ```

2. **Initialize the SDK**

   Configure the SDK with the providers you want to use. You only need to provide configuration for the providers you'll be using:

   ```typescript
   const voltax = new Voltax({
     // Paystack configuration
     paystack: {
       secretKey: process.env.PAYSTACK_SECRET_KEY!,
     },
     // Flutterwave configuration (optional)
     flutterwave: {
       secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
     },
     // Hubtel configuration (optional)
     hubtel: {
       clientId: process.env.HUBTEL_CLIENT_ID!,
       clientSecret: process.env.HUBTEL_CLIENT_SECRET!,
       merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT!,
     },
   });
   ```

3. **Initialize a Payment**

   Use the provider of your choice to initialize a payment:

   ```typescript
   import { Currency } from 'voltax-node';

   const response = await voltax.paystack.initializePayment({
     amount: 100.00,  // Amount in major currency units (e.g., 100 NGN)
     email: 'customer@example.com',
     currency: Currency.NGN,
     reference: 'unique-transaction-ref-123',
     callbackUrl: 'https://yoursite.com/payment/callback',
     description: 'Payment for Order #123',
   });

   // Redirect user to complete payment
   console.log(response.authorizationUrl);
   ```

4. **Verify the Payment**

   After the user completes the payment, verify the transaction:

   ```typescript
   import { PaymentStatus } from 'voltax-node';

   const verification = await voltax.paystack.verifyTransaction('unique-transaction-ref-123');

   if (verification.status === PaymentStatus.SUCCESS) {
     console.log('Payment successful!');
   } else if (verification.status === PaymentStatus.PENDING) {
     console.log('Payment is still processing...');
   } else {
     console.log('Payment failed.');
   }
   ```

</Steps>

<Aside type="tip">
  Always store your API keys securely in environment variables. Never commit them to version control.
</Aside>

## Supported Providers

| Provider | Countries | Currencies |
|----------|-----------|------------|
| [Paystack](/guides/paystack/) | Nigeria, Ghana, South Africa, Kenya | NGN, GHS, ZAR, KES, USD |
| [Flutterwave](/guides/flutterwave/) | Nigeria, Ghana, Kenya, South Africa, and more | NGN, GHS, KES, ZAR, USD |
| [Hubtel](/guides/hubtel/) | Ghana | GHS |

## Configuration Reference

### Paystack Configuration

```typescript
interface PaystackConfig {
  secretKey: string;  // Your Paystack secret key
}
```

### Flutterwave Configuration

```typescript
interface FlutterwaveConfig {
  secretKey: string;  // Your Flutterwave secret key
}
```

### Hubtel Configuration

```typescript
interface HubtelConfig {
  clientId: string;           // Your Hubtel client ID
  clientSecret: string;       // Your Hubtel client secret
  merchantAccountNumber: string;  // Your Hubtel merchant account number
}
```

## Next Steps

- Learn about [initializing payments](/guides/payments/) with detailed examples
- Explore [error handling](/guides/error-handling/) patterns
- Check out provider-specific guides:
  - [Paystack Guide](/guides/paystack/)
  - [Flutterwave Guide](/guides/flutterwave/)
  - [Hubtel Guide](/guides/hubtel/)
- Browse the complete [API Reference](/reference/)
