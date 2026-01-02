---
title: Initializing Payments
description: Learn how to initialize and manage payments with Voltax.
---

import { Tabs, TabItem, Aside, Steps } from '@astrojs/starlight/components';

This guide covers everything you need to know about initializing payments, verifying transactions, and handling payment responses with Voltax.

## Payment Flow Overview

All Voltax payment providers follow the same general flow:

<Steps>

1. **Initialize Payment**: Call `initializePayment()` with payment details
2. **Redirect User**: Redirect the customer to the `authorizationUrl` 
3. **Customer Completes Payment**: Customer enters payment details on the provider's page
4. **Callback**: Provider redirects customer back to your `callbackUrl`
5. **Verify Transaction**: Call `verifyTransaction()` to confirm payment status

</Steps>

## The InitiatePaymentDTO

All providers use a standardized payment initialization payload:

```typescript
import { Currency } from 'voltax-node';

interface InitiatePaymentDTO {
  // Required fields
  amount: number;         // Amount in major currency units (e.g., 100.50)
  email: string;          // Customer's email address
  currency: Currency;     // Currency code (NGN, GHS, USD, KES, ZAR)

  // Optional fields
  reference?: string;     // Your unique transaction reference
  mobileNumber?: string;  // Customer's mobile number (10-15 digits)
  description?: string;   // Transaction description (max 255 chars)
  callbackUrl?: string;   // URL to redirect after payment
  metadata?: Record<string, any>;  // Custom data to attach

  // Provider-specific options
  options?: {
    paystack?: PaystackOptions;
    flutterwave?: FlutterwaveOptions;
    hubtel?: HubtelOptions;
  } | null;
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `amount` | `number` | Payment amount in major units (e.g., 100 for 100 NGN) |
| `email` | `string` | Valid email address of the customer |
| `currency` | `Currency` | One of: `Currency.NGN`, `Currency.GHS`, `Currency.USD`, `Currency.KES`, `Currency.ZAR` |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `reference` | `string` | Unique identifier for the transaction. Required by Flutterwave and Hubtel |
| `mobileNumber` | `string` | Customer phone number (10-15 characters) |
| `description` | `string` | Brief description of the payment (max 255 chars) |
| `callbackUrl` | `string` | URL to redirect after payment completion |
| `metadata` | `Record<string, any>` | Custom key-value data attached to the transaction |

## Initialize a Payment

### Basic Example

```typescript
import Voltax, { Currency } from 'voltax-node';

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

const payment = await voltax.paystack.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `order-${Date.now()}`,
  callbackUrl: 'https://yoursite.com/payment/callback',
});

console.log(payment);
// {
//   status: 'PENDING',
//   reference: 'order-1234567890',
//   authorizationUrl: 'https://checkout.paystack.com/xxx',
//   externalReference: 'order-1234567890',
//   raw: { ... }
// }
```

### With Metadata

Attach custom data to track orders, users, or any relevant information:

```typescript
const payment = await voltax.paystack.initializePayment({
  amount: 2500,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: 'order-123',
  metadata: {
    orderId: 'ORD-12345',
    userId: 'USR-67890',
    productName: 'Premium Subscription',
    quantity: 1,
  },
});
```

### With Provider-Specific Options

Each provider supports additional options through the `options` field:

<Tabs>
  <TabItem label="Paystack">
  ```typescript
  import { PaystackChannel } from 'voltax-node';

  const payment = await voltax.paystack.initializePayment({
    amount: 5000,
    email: 'customer@example.com',
    currency: Currency.NGN,
    options: {
      paystack: {
        // Limit payment channels
        channels: [PaystackChannel.CARD, PaystackChannel.BANK_TRANSFER],
        // Split payment to subaccount
        subaccount: 'ACCT_xxxxxxxx',
        // Add transaction charge
        transactionCharge: 100,
        // For subscription payments
        plan: 'PLN_xxxxxxxx',
      },
    },
  });
  ```
  </TabItem>
  <TabItem label="Flutterwave">
  ```typescript
  const payment = await voltax.flutterwave.initializePayment({
    amount: 5000,
    email: 'customer@example.com',
    currency: Currency.NGN,
    reference: 'order-123',  // Required for Flutterwave
    options: {
      flutterwave: {
        customerName: 'John Doe',
        pageTitle: 'My Store Checkout',
        logoUrl: 'https://yoursite.com/logo.png',
        sessionDuration: 30,  // Minutes (1-1440)
        maxRetryAttempts: 3,  // Max retry attempts (1-10)
        paymentOptions: 'card,banktransfer,ussd',
        subaccounts: [
          { id: 'RS_xxxxxxxx' },
        ],
      },
    },
  });
  ```
  </TabItem>
  <TabItem label="Hubtel">
  ```typescript
  const payment = await voltax.hubtel.initializePayment({
    amount: 100,
    email: 'customer@example.com',
    currency: Currency.GHS,
    reference: 'order-123',  // Required for Hubtel
    callbackUrl: 'https://yoursite.com/webhook',  // Required for Hubtel
    options: {
      hubtel: {
        returnUrl: 'https://yoursite.com/success',  // Required for Hubtel
        cancellationUrl: 'https://yoursite.com/cancelled',
      },
    },
  });
  ```
  </TabItem>
</Tabs>

## The VoltaxPaymentResponse

All payment operations return a standardized response:

```typescript
interface VoltaxPaymentResponse {
  status: PaymentStatus;      // SUCCESS, PENDING, or FAILED
  reference: string;          // Your transaction reference
  authorizationUrl?: string;  // URL to redirect customer (for initialization)
  externalReference?: string; // Provider's internal reference
  raw?: any;                  // Original provider response
}
```

### PaymentStatus Enum

```typescript
enum PaymentStatus {
  SUCCESS = 'SUCCESS',   // Payment completed successfully
  PENDING = 'PENDING',   // Payment is processing or awaiting action
  FAILED = 'FAILED',     // Payment failed or was cancelled
}
```

## Verify a Transaction

After the customer completes payment, verify the transaction status:

```typescript
import { PaymentStatus } from 'voltax-node';

const result = await voltax.paystack.verifyTransaction('order-123');

switch (result.status) {
  case PaymentStatus.SUCCESS:
    // Payment successful - fulfill the order
    console.log('Payment completed!');
    console.log('Provider reference:', result.externalReference);
    break;

  case PaymentStatus.PENDING:
    // Payment still processing
    console.log('Payment is still pending...');
    break;

  case PaymentStatus.FAILED:
    // Payment failed
    console.log('Payment failed');
    break;
}
```

## Get Payment Status

For a quick status check without full transaction details:

```typescript
const status = await voltax.paystack.getPaymentStatus('order-123');

if (status === PaymentStatus.SUCCESS) {
  console.log('Order is paid!');
}
```

## Working with Multiple Providers

Voltax makes it easy to use multiple providers in the same application:

```typescript
const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
  flutterwave: { secretKey: process.env.FLUTTERWAVE_SECRET_KEY! },
  hubtel: {
    clientId: process.env.HUBTEL_CLIENT_ID!,
    clientSecret: process.env.HUBTEL_CLIENT_SECRET!,
    merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT!,
  },
});

// Use Paystack for Nigerian customers
const ngPayment = await voltax.paystack.initializePayment({
  amount: 5000,
  email: 'customer@ng.example.com',
  currency: Currency.NGN,
});

// Use Hubtel for Ghanaian customers
const ghPayment = await voltax.hubtel.initializePayment({
  amount: 100,
  email: 'customer@gh.example.com',
  currency: Currency.GHS,
  reference: 'gh-order-123',
  callbackUrl: 'https://yoursite.com/webhook',
  options: {
    hubtel: { returnUrl: 'https://yoursite.com/success' },
  },
});
```

## Best Practices

<Aside type="tip" title="Generate Unique References">
  Always generate unique transaction references to avoid duplicate payments. Consider using UUIDs or combining timestamps with random strings.
</Aside>

<Aside type="caution" title="Always Verify Payments">
  Never trust callback parameters alone. Always verify the transaction status server-side using `verifyTransaction()` before fulfilling orders.
</Aside>

### Example: Robust Payment Flow

```typescript
import Voltax, { Currency, PaymentStatus, VoltaxValidationError, VoltaxGatewayError } from 'voltax-node';
import { randomUUID } from 'crypto';

async function processPayment(orderDetails: {
  amount: number;
  email: string;
  currency: Currency;
}) {
  const voltax = new Voltax({
    paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
  });

  const reference = `order-${randomUUID()}`;

  try {
    // Step 1: Initialize payment
    const payment = await voltax.paystack.initializePayment({
      ...orderDetails,
      reference,
      callbackUrl: `https://yoursite.com/callback?ref=${reference}`,
    });

    // Step 2: Store reference in your database
    await savePaymentReference(reference, orderDetails);

    // Step 3: Return authorization URL to client
    return {
      success: true,
      checkoutUrl: payment.authorizationUrl,
      reference,
    };
  } catch (error) {
    if (error instanceof VoltaxValidationError) {
      return { success: false, error: 'Invalid payment details' };
    }
    if (error instanceof VoltaxGatewayError) {
      return { success: false, error: 'Payment provider error' };
    }
    throw error;
  }
}

async function handleCallback(reference: string) {
  const voltax = new Voltax({
    paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
  });

  // Always verify server-side
  const result = await voltax.paystack.verifyTransaction(reference);

  if (result.status === PaymentStatus.SUCCESS) {
    await fulfillOrder(reference);
    return { success: true };
  }

  return { success: false, status: result.status };
}
```

## Next Steps

- Learn about [Error Handling](/guides/error-handling/) for robust payment processing
- Check provider-specific guides for advanced features:
  - [Paystack Guide](/guides/paystack/)
  - [Flutterwave Guide](/guides/flutterwave/)
  - [Hubtel Guide](/guides/hubtel/)
