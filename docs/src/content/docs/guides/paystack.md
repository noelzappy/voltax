---
title: Paystack Integration
description: Complete guide to integrating Paystack payments with Voltax.
---

import { Aside, Tabs, TabItem, Steps } from '@astrojs/starlight/components';

[Paystack](https://paystack.com) is one of Africa's leading payment processors, supporting businesses in Nigeria, Ghana, South Africa, and Kenya. This guide covers how to integrate Paystack payments using Voltax.

## Prerequisites

Before you begin, you'll need:
- A Paystack account (sign up at [paystack.com](https://paystack.com))
- Your Paystack secret key (found in Settings → API Keys & Webhooks)

<Aside type="caution">
  Never expose your secret key in client-side code. Always keep it secure on your server.
</Aside>

## Configuration

Initialize a Paystack provider with your credentials:

```typescript
import Voltax from '@noelzappy/voltax';

const paystack = Voltax('paystack', {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});
```

## Initiate a Payment

### Basic Payment

```typescript
import { Currency } from '@noelzappy/voltax';

const payment = await paystack.initiatePayment({
  amount: 5000,  // 5,000 NGN (Voltax handles kobo conversion)
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `txn-${Date.now()}`,
  callbackUrl: 'https://yoursite.com/payment/callback',
});

// Redirect customer to complete payment
console.log(payment.authorizationUrl);
// "https://checkout.paystack.com/xxxxxxxxxx"
```

<Aside type="tip" title="Amount Conversion">
  Voltax automatically converts amounts to kobo (minor units) for Paystack. Pass amounts in major units (e.g., 5000 for ₦5,000).
</Aside>

### With Metadata

Attach custom data to track orders and customers:

```typescript
const payment = await paystack.initiatePayment({
  amount: 15000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  description: 'Order #12345',
  metadata: {
    orderId: 'ORD-12345',
    customerId: 'CUST-67890',
    items: ['Product A', 'Product B'],
    cart_id: 398,
  },
});
```

## Paystack-Specific Options

Paystack supports several advanced options as top-level fields in the payment DTO:

### Payment Channels

Limit which payment methods customers can use:

```typescript
import { PaystackChannel } from '@noelzappy/voltax';

const payment = await paystack.initiatePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  channels: [
    PaystackChannel.CARD,
    PaystackChannel.BANK_TRANSFER,
    PaystackChannel.USSD,
  ],
});
```

**Available Channels:**

| Channel | Value | Description |
|---------|-------|-------------|
| `CARD` | `"card"` | Debit/Credit cards |
| `BANK` | `"bank"` | Pay with bank account |
| `BANK_TRANSFER` | `"bank_transfer"` | Bank transfer |
| `USSD` | `"ussd"` | USSD payment |
| `QR` | `"qr"` | QR code payment |
| `MOBILE_MONEY` | `"mobile_money"` | Mobile money (Ghana) |
| `EFT` | `"eft"` | Electronic Funds Transfer (South Africa) |
| `APPLE_PAY` | `"apple_pay"` | Apple Pay |
| `PAYATTITUDE` | `"payattitude"` | PayAttitude |

### Split Payments

Split payments between accounts using subaccounts or split codes:

```typescript
const payment = await paystack.initiatePayment({
  amount: 10000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  // Use a subaccount
  subaccount: 'ACCT_xxxxxxxxxx',
  // Or use a split code for multi-party splits
  splitCode: 'SPL_xxxxxxxxxx',
  // Who bears the transaction charge
  bearer: 'subaccount',  // or 'account'
  // Additional charge to add (in kobo)
  transactionCharge: 10000,  // ₦100 extra
});
```

### Subscription Payments

For recurring payments with Paystack Plans:

```typescript
const payment = await paystack.initiatePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  plan: 'PLN_xxxxxxxxxx',
  // Limit number of subscription invoices
  invoiceLimit: 12,  // 12 months
});
```

### Complete Options Reference

All Paystack-specific options are available as top-level fields in the payment DTO:

```typescript
interface PaystackPaymentDTO {
  // Base fields
  amount: number;
  email: string;
  currency: Currency;
  reference?: string;
  callbackUrl?: string;
  description?: string;
  metadata?: Record<string, any>;
  
  // Paystack-specific options
  channels?: PaystackChannel[];      // Limit payment channels
  subaccount?: string;               // Subaccount for split payments
  splitCode?: string;                // Split code for multi-party splits
  bearer?: 'account' | 'subaccount'; // Who bears Paystack fees
  transactionCharge?: number;        // Flat fee to charge (in kobo)
  plan?: string;                     // Subscription plan code
  invoiceLimit?: number;             // Max subscription charges
}
```

## Verify a Transaction

After the customer completes payment, verify the transaction:

```typescript
import { PaymentStatus } from '@noelzappy/voltax';

const result = await paystack.verifyTransaction('txn-123456');

console.log(result);
// {
//   status: 'SUCCESS',
//   reference: 'txn-123456',
//   externalReference: '1234567890',
//   raw: { ... }
// }

if (result.status === PaymentStatus.SUCCESS) {
  // Payment successful - fulfill order
  const amount = result.raw.data.amount / 100;  // Convert from kobo
  console.log(`Received ₦${amount}`);
}
```

### Status Mapping

Voltax maps Paystack statuses to standardized values:

| Paystack Status | Voltax Status |
|-----------------|---------------|
| `success` | `SUCCESS` |
| `failed` | `FAILED` |
| `reversed` | `FAILED` |
| `abandoned` | `FAILED` |
| Other | `PENDING` |

## Get Payment Status

For a quick status check:

```typescript
const status = await paystack.getPaymentStatus('txn-123456');

if (status === PaymentStatus.SUCCESS) {
  console.log('Payment successful!');
}
```

## Complete Example

Here's a full Express.js integration example:

```typescript
import express from 'express';
import Voltax, { Currency, PaymentStatus, PaystackChannel } from '@noelzappy/voltax';

const app = express();
app.use(express.json());

const paystack = Voltax('paystack', {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});

// Initiate payment
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;

    const payment = await paystack.initiatePayment({
      amount,
      email,
      currency: Currency.NGN,
      reference: `order-${orderId}-${Date.now()}`,
      callbackUrl: `${process.env.BASE_URL}/payment/callback`,
      description: `Payment for Order #${orderId}`,
      metadata: { orderId },
      channels: [
        PaystackChannel.CARD,
        PaystackChannel.BANK_TRANSFER,
      ],
    });

    res.json({
      success: true,
      checkoutUrl: payment.authorizationUrl,
      reference: payment.reference,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Payment callback
app.get('/payment/callback', async (req, res) => {
  const { reference } = req.query;

  try {
    const result = await paystack.verifyTransaction(reference as string);

    if (result.status === PaymentStatus.SUCCESS) {
      // Mark order as paid in your database
      res.redirect('/order/success');
    } else {
      res.redirect('/order/failed');
    }
  } catch (error) {
    res.redirect('/order/error');
  }
});

app.listen(3000);
```

## Supported Currencies

| Currency | Code | Country |
|----------|------|---------|
| Nigerian Naira | `NGN` | Nigeria |
| Ghanaian Cedi | `GHS` | Ghana |
| South African Rand | `ZAR` | South Africa |
| Kenyan Shilling | `KES` | Kenya |
| US Dollar | `USD` | International |

## Next Steps

- Learn about [Error Handling](/guides/error-handling/) for Paystack errors
- Explore the [API Reference](/reference/classes/paystackadapter/) for PaystackAdapter
- Set up [Webhook handling](https://paystack.com/docs/payments/webhooks) for real-time notifications
