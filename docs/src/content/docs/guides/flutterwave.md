---
title: Flutterwave Integration
description: Complete guide to integrating Flutterwave payments with Voltax.
---

import { Aside, Tabs, TabItem, Steps } from '@astrojs/starlight/components';

[Flutterwave](https://flutterwave.com) is a leading payment technology company providing seamless payment solutions across Africa and globally. This guide covers how to integrate Flutterwave payments using Voltax.

## Prerequisites

Before you begin, you'll need:
- A Flutterwave account (sign up at [flutterwave.com](https://flutterwave.com))
- Your Flutterwave secret key (found in Settings → API)

<Aside type="caution">
  Never expose your secret key in client-side code. Always keep it secure on your server.
</Aside>

## Configuration

Initialize Voltax with your Flutterwave credentials:

```typescript
import Voltax from '@noelzappy/voltax';

const voltax = new Voltax({
  flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
  },
});
```

## Initialize a Payment

<Aside type="note">
  Unlike some providers, Flutterwave **requires** a transaction reference (`reference`) for all payments.
</Aside>

### Basic Payment

```typescript
import { Currency } from '@noelzappy/voltax';

const payment = await voltax.flutterwave.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `flw-${Date.now()}`,  // Required!
  callbackUrl: 'https://yoursite.com/payment/callback',
});

// Redirect customer to complete payment
console.log(payment.authorizationUrl);
// "https://checkout.flutterwave.com/v3/hosted/pay/xxxxxxxxxx"
```

### With Customer Details

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 10000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `order-${Date.now()}`,
  mobileNumber: '+2348012345678',
  description: 'Premium Subscription',
  callbackUrl: 'https://yoursite.com/callback',
  metadata: {
    orderId: 'ORD-12345',
    plan: 'premium',
  },
  options: {
    flutterwave: {
      customerName: 'John Doe',
    },
  },
});
```

## Flutterwave-Specific Options

Flutterwave supports extensive customization through the `options.flutterwave` field:

### Checkout Customization

Customize the payment page appearance:

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `flw-${Date.now()}`,
  options: {
    flutterwave: {
      // Customer name displayed on checkout
      customerName: 'John Doe',
      
      // Checkout page title
      pageTitle: 'My Store Checkout',
      
      // Your logo on checkout page
      logoUrl: 'https://yoursite.com/logo.png',
    },
  },
});
```

### Session and Retry Settings

Control session behavior:

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `flw-${Date.now()}`,
  options: {
    flutterwave: {
      // Session timeout in minutes (1-1440)
      sessionDuration: 30,
      
      // Max payment retry attempts (1-10)
      maxRetryAttempts: 3,
      
      // Link expiration date
      linkExpiration: new Date('2026-12-31'),
    },
  },
});
```

### Payment Options

Specify allowed payment methods:

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `flw-${Date.now()}`,
  options: {
    flutterwave: {
      // Comma-separated payment options
      paymentOptions: 'card,banktransfer,ussd,mobilemoney',
    },
  },
});
```

**Available Payment Options:**
- `card` - Debit/Credit cards
- `banktransfer` - Bank transfers
- `ussd` - USSD payments
- `mobilemoney` - Mobile money
- `barter` - Barter by Flutterwave
- `nqr` - NQR payments

### Subscription/Payment Plans

For recurring payments:

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `sub-${Date.now()}`,
  options: {
    flutterwave: {
      // Payment plan ID (from Flutterwave dashboard)
      paymentPlan: 12345,
    },
  },
});
```

### Split Payments with Subaccounts

Split payments between multiple accounts:

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 10000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `split-${Date.now()}`,
  options: {
    flutterwave: {
      subaccounts: [
        { id: 'RS_xxxxxxxxxxxxxxxxx' },
        { id: 'RS_yyyyyyyyyyyyyyyyy' },
      ],
    },
  },
});
```

### Complete Options Reference

```typescript
interface FlutterwaveOptions {
  // Customer name for checkout display
  customerName?: string;
  
  // Checkout page title
  pageTitle?: string;
  
  // Logo URL for checkout page (must be valid URL)
  logoUrl?: string;
  
  // Session timeout in minutes (1-1440)
  sessionDuration?: number;
  
  // Maximum retry attempts (1-10)
  maxRetryAttempts?: number;
  
  // Payment plan ID for subscriptions
  paymentPlan?: number;
  
  // Comma-separated payment options
  paymentOptions?: string;
  
  // Link expiration date
  linkExpiration?: Date;
  
  // Subaccounts for split payments
  subaccounts?: Array<{ id: string }>;
}
```

## Verify a Transaction

After the customer completes payment, verify the transaction:

```typescript
import { PaymentStatus } from '@noelzappy/voltax';

const result = await voltax.flutterwave.verifyTransaction('flw-123456');

console.log(result);
// {
//   status: 'SUCCESS',
//   reference: 'flw-123456',
//   externalReference: 'FLW-MOCK-xxxxxxxxxx',
//   raw: { ... }
// }

if (result.status === PaymentStatus.SUCCESS) {
  // Access detailed transaction data
  const { amount, currency, customer } = result.raw.data;
  console.log(`Received ${currency} ${amount} from ${customer.email}`);
}
```

### Status Mapping

Voltax maps Flutterwave statuses to standardized values:

| Flutterwave Status | Voltax Status |
|--------------------|---------------|
| `successful` | `SUCCESS` |
| `failed` | `FAILED` |
| Other | `PENDING` |

## Get Payment Status

For a quick status check:

```typescript
const status = await voltax.flutterwave.getPaymentStatus('flw-123456');

if (status === PaymentStatus.SUCCESS) {
  console.log('Payment successful!');
}
```

## Complete Example

Here's a full Express.js integration example:

```typescript
import express from 'express';
import Voltax, { Currency, PaymentStatus } from '@noelzappy/voltax';
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json());

const voltax = new Voltax({
  flutterwave: { secretKey: process.env.FLUTTERWAVE_SECRET_KEY! },
});

// Initialize payment
app.post('/api/payments/flutterwave', async (req, res) => {
  try {
    const { amount, email, customerName, orderId } = req.body;

    const reference = `order-${orderId}-${randomUUID()}`;

    const payment = await voltax.flutterwave.initializePayment({
      amount,
      email,
      currency: Currency.NGN,
      reference,
      mobileNumber: req.body.phone,
      callbackUrl: `${process.env.BASE_URL}/payment/callback`,
      metadata: {
        orderId,
        createdAt: new Date().toISOString(),
      },
      options: {
        flutterwave: {
          customerName,
          pageTitle: 'My Store - Checkout',
          logoUrl: `${process.env.BASE_URL}/logo.png`,
          sessionDuration: 30,
          maxRetryAttempts: 3,
          paymentOptions: 'card,banktransfer,ussd',
        },
      },
    });

    // Store reference in database
    await savePaymentReference(orderId, reference);

    res.json({
      success: true,
      checkoutUrl: payment.authorizationUrl,
      reference: payment.reference,
    });
  } catch (error) {
    console.error('Payment initialization failed:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Payment callback
app.get('/payment/callback', async (req, res) => {
  const { tx_ref, status } = req.query;

  try {
    // Always verify server-side regardless of callback status
    const result = await voltax.flutterwave.verifyTransaction(tx_ref as string);

    if (result.status === PaymentStatus.SUCCESS) {
      await markOrderAsPaid(tx_ref as string);
      res.redirect('/order/success');
    } else if (result.status === PaymentStatus.PENDING) {
      res.redirect('/order/pending');
    } else {
      res.redirect('/order/failed');
    }
  } catch (error) {
    console.error('Verification failed:', error);
    res.redirect('/order/error');
  }
});

// Webhook endpoint
app.post('/webhooks/flutterwave', async (req, res) => {
  const payload = req.body;

  // Verify webhook signature (implement based on Flutterwave docs)
  
  if (payload.event === 'charge.completed') {
    const { tx_ref } = payload.data;
    
    // Verify and fulfill
    const result = await voltax.flutterwave.verifyTransaction(tx_ref);
    if (result.status === PaymentStatus.SUCCESS) {
      await fulfillOrder(tx_ref);
    }
  }

  res.status(200).send('OK');
});

app.listen(3000);
```

## Supported Currencies

| Currency | Code | Countries |
|----------|------|-----------|
| Nigerian Naira | `NGN` | Nigeria |
| Ghanaian Cedi | `GHS` | Ghana |
| Kenyan Shilling | `KES` | Kenya |
| South African Rand | `ZAR` | South Africa |
| US Dollar | `USD` | International |

Flutterwave supports many more currencies. Check their documentation for the complete list.

## Important Notes

<Aside type="caution" title="Reference is Required">
  Unlike Paystack, Flutterwave **requires** a `reference` for all payment initializations. Always provide a unique reference.
</Aside>

<Aside type="tip" title="Metadata Handling">
  Voltax automatically transforms your metadata object into Flutterwave's expected format when sending to their API.
</Aside>

## Next Steps

- Learn about [Error Handling](/guides/error-handling/) for Flutterwave errors
- Explore the [API Reference](/reference/classes/flutterwaveadapter/) for FlutterwaveAdapter
- Set up [Webhook handling](https://developer.flutterwave.com/docs/integration-guides/webhooks) for real-time notifications
