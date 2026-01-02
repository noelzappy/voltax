---
title: Examples
description: Real-world examples and common integration patterns for Voltax.
---

import { Tabs, TabItem, Aside } from '@astrojs/starlight/components';

This page provides practical examples for common payment integration scenarios using Voltax.

## E-commerce Checkout

A typical e-commerce checkout flow with order tracking:

```typescript
import Voltax, { Currency, PaymentStatus } from '@noelzappy/voltax';
import { randomUUID } from 'crypto';

// Initialize Voltax
const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

interface Order {
  id: string;
  amount: number;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

async function createCheckout(order: Order) {
  const reference = `order-${order.id}-${randomUUID().slice(0, 8)}`;

  const payment = await voltax.paystack.initializePayment({
    amount: order.amount,
    email: order.customerEmail,
    currency: Currency.NGN,
    reference,
    callbackUrl: `https://yourstore.com/checkout/complete?orderId=${order.id}`,
    description: `Order #${order.id}`,
    metadata: {
      orderId: order.id,
      itemCount: order.items.length,
      items: order.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
    },
  });

  // Save payment reference to database
  await db.orders.update(order.id, { 
    paymentReference: reference,
    paymentStatus: 'pending',
  });

  return payment.authorizationUrl;
}

async function handlePaymentCallback(orderId: string, reference: string) {
  const result = await voltax.paystack.verifyTransaction(reference);

  if (result.status === PaymentStatus.SUCCESS) {
    await db.orders.update(orderId, {
      paymentStatus: 'paid',
      paidAt: new Date(),
    });

    // Trigger order fulfillment
    await fulfillOrder(orderId);

    return { success: true, message: 'Payment successful!' };
  }

  return { success: false, message: 'Payment not completed' };
}
```

## Subscription Payments

Using Paystack's subscription plan feature:

```typescript
import Voltax, { Currency, PaystackChannel } from '@noelzappy/voltax';

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

async function createSubscription(
  email: string,
  planCode: string,  // Created in Paystack dashboard
  maxCharges?: number
) {
  const payment = await voltax.paystack.initializePayment({
    amount: 0,  // Amount comes from the plan
    email,
    currency: Currency.NGN,
    reference: `sub-${Date.now()}`,
    callbackUrl: 'https://yourapp.com/subscription/callback',
    options: {
      paystack: {
        plan: planCode,
        invoiceLimit: maxCharges,  // Optional: limit subscription duration
        channels: [PaystackChannel.CARD],  // Subscriptions require card
      },
    },
  });

  return payment.authorizationUrl;
}
```

## Multi-Currency Support

Supporting different currencies based on customer location:

```typescript
import Voltax, { Currency, PaymentStatus } from '@noelzappy/voltax';

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
  flutterwave: { secretKey: process.env.FLUTTERWAVE_SECRET_KEY! },
  hubtel: {
    clientId: process.env.HUBTEL_CLIENT_ID!,
    clientSecret: process.env.HUBTEL_CLIENT_SECRET!,
    merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT!,
  },
});

interface PaymentRequest {
  amount: number;
  email: string;
  country: 'NG' | 'GH' | 'KE' | 'ZA';
  reference: string;
  callbackUrl: string;
}

async function initializePayment(request: PaymentRequest) {
  const { amount, email, country, reference, callbackUrl } = request;

  // Map country to currency and provider
  const config: Record<string, { currency: Currency; provider: 'paystack' | 'flutterwave' | 'hubtel' }> = {
    NG: { currency: Currency.NGN, provider: 'paystack' },
    GH: { currency: Currency.GHS, provider: 'hubtel' },
    KE: { currency: Currency.KES, provider: 'flutterwave' },
    ZA: { currency: Currency.ZAR, provider: 'paystack' },
  };

  const { currency, provider } = config[country];

  // Common payload
  const payload = {
    amount,
    email,
    currency,
    reference,
    callbackUrl,
  };

  switch (provider) {
    case 'paystack':
      return voltax.paystack.initializePayment(payload);

    case 'flutterwave':
      return voltax.flutterwave.initializePayment(payload);

    case 'hubtel':
      return voltax.hubtel.initializePayment({
        ...payload,
        options: {
          hubtel: {
            returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
          },
        },
      });
  }
}
```

## Express.js REST API

Complete REST API for payment operations:

```typescript
import express from 'express';
import Voltax, {
  Currency,
  PaymentStatus,
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
} from '@noelzappy/voltax';

const app = express();
app.use(express.json());

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

// Error handling middleware
const handleVoltaxError = (error: unknown, res: express.Response) => {
  if (error instanceof VoltaxValidationError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error.message,
      details: error.errors,
    });
  }

  if (error instanceof VoltaxGatewayError) {
    console.error(`[${error.provider}] Gateway error:`, error.data);
    return res.status(502).json({
      error: 'GATEWAY_ERROR',
      message: 'Payment service error. Please try again.',
    });
  }

  if (error instanceof VoltaxNetworkError) {
    return res.status(503).json({
      error: 'SERVICE_UNAVAILABLE',
      message: 'Payment service temporarily unavailable.',
    });
  }

  console.error('Unexpected error:', error);
  return res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred.',
  });
};

// Initialize payment
app.post('/api/v1/payments', async (req, res) => {
  try {
    const { amount, email, metadata } = req.body;

    const reference = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const payment = await voltax.paystack.initializePayment({
      amount,
      email,
      currency: Currency.NGN,
      reference,
      callbackUrl: `${process.env.BASE_URL}/api/v1/payments/callback`,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: {
        reference: payment.reference,
        checkoutUrl: payment.authorizationUrl,
        status: payment.status,
      },
    });
  } catch (error) {
    handleVoltaxError(error, res);
  }
});

// Get payment status
app.get('/api/v1/payments/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    const result = await voltax.paystack.verifyTransaction(reference);

    res.json({
      success: true,
      data: {
        reference: result.reference,
        status: result.status,
        externalReference: result.externalReference,
      },
    });
  } catch (error) {
    handleVoltaxError(error, res);
  }
});

// Payment callback
app.get('/api/v1/payments/callback', async (req, res) => {
  const { reference } = req.query;

  try {
    const result = await voltax.paystack.verifyTransaction(reference as string);

    const redirectUrl = result.status === PaymentStatus.SUCCESS
      ? `${process.env.FRONTEND_URL}/payment/success?ref=${reference}`
      : `${process.env.FRONTEND_URL}/payment/failed?ref=${reference}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
});

app.listen(3000, () => {
  console.log('Payment API running on port 3000');
});
```

## Next.js API Routes

Using Voltax with Next.js App Router:

```typescript
// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Voltax, { Currency } from '@noelzappy/voltax';

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, orderId } = body;

    const reference = `order-${orderId}-${Date.now()}`;

    const payment = await voltax.paystack.initializePayment({
      amount,
      email,
      currency: Currency.NGN,
      reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
    });

    return NextResponse.json({
      checkoutUrl: payment.authorizationUrl,
      reference: payment.reference,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 400 }
    );
  }
}
```

```typescript
// app/api/payments/verify/[reference]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Voltax, { PaymentStatus } from '@noelzappy/voltax';

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const result = await voltax.paystack.verifyTransaction(params.reference);

    return NextResponse.json({
      status: result.status,
      success: result.status === PaymentStatus.SUCCESS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 400 }
    );
  }
}
```

## Webhook Handler

Handling payment webhooks securely:

```typescript
import express from 'express';
import crypto from 'crypto';
import Voltax, { PaymentStatus } from '@noelzappy/voltax';

const app = express();

const voltax = new Voltax({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
});

// Paystack webhook handler
app.post(
  '/webhooks/paystack',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(req.body)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'charge.success') {
      const { reference } = event.data;

      // Always verify the transaction
      const result = await voltax.paystack.verifyTransaction(reference);

      if (result.status === PaymentStatus.SUCCESS) {
        // Process the successful payment
        await processSuccessfulPayment(reference, event.data);
      }
    }

    res.status(200).send('OK');
  }
);

async function processSuccessfulPayment(reference: string, data: any) {
  // Update order status
  // Send confirmation email
  // Trigger fulfillment
  console.log(`Payment ${reference} processed successfully`);
}
```

## Testing with Mock Data

For testing purposes:

```typescript
import Voltax, { Currency, PaymentStatus } from '@noelzappy/voltax';

// Use test/sandbox keys
const voltax = new Voltax({
  paystack: { 
    secretKey: process.env.PAYSTACK_TEST_SECRET_KEY!  // sk_test_xxx
  },
});

// Test card numbers for Paystack
const testCards = {
  success: '4084084084084081',
  declined: '4084080000005408',
  timeout: '5060666666666666666',
};

// Initialize a test payment
async function testPayment() {
  const payment = await voltax.paystack.initializePayment({
    amount: 100,  // ₦100
    email: 'test@example.com',
    currency: Currency.NGN,
    reference: `test-${Date.now()}`,
  });

  console.log('Test payment URL:', payment.authorizationUrl);
  return payment;
}
```

<Aside type="tip" title="Test Mode">
  Always use test/sandbox API keys during development. Each provider has specific test cards and mobile money numbers for simulating different scenarios.
</Aside>

## Further Reading

- [Getting Started Guide](/guides/getting-started/)
- [Error Handling](/guides/error-handling/)
- [Paystack Integration](/guides/paystack/)
- [Flutterwave Integration](/guides/flutterwave/)
- [Hubtel Integration](/guides/hubtel/)
- [API Reference](/reference/)
