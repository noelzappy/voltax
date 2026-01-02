<div align="center">

# ⚡ Voltax

**The Unified Payment SDK for Africa**

[![npm version](https://img.shields.io/npm/v/@noelzappy/voltax.svg)](https://www.npmjs.com/package/@noelzappy/voltax)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Documentation](https://voltax.dev) · [Report Bug](https://github.com/noelzappy/voltax/issues) · [Request Feature](https://github.com/noelzappy/voltax/issues)

</div>

---

## Why Voltax?

Building payment systems in Africa means dealing with multiple payment gateways, each with its own API, documentation, and quirks. **Voltax** solves this by providing:

- 🔌 **One Interface, Multiple Gateways** - Write once, accept payments from Paystack, Flutterwave, Hubtel, and more
- 🛡️ **Type-Safe** - Built with TypeScript and Zod for runtime validation
- 🔄 **Easy Provider Switching** - Change payment providers without rewriting your code
- ⚡ **Lightweight** - Tree-shakeable, ESM & CJS support
- 🧪 **Well Tested** - Comprehensive test coverage

## Supported Payment Gateways

| Gateway | Countries | Status |
|---------|-----------|--------|
| [Paystack](https://paystack.com) | Nigeria, Ghana, South Africa, Kenya | ✅ Ready |
| [Flutterwave](https://flutterwave.com) | Nigeria, Ghana, Kenya, South Africa + | ✅ Ready |
| [Hubtel](https://hubtel.com) | Ghana | ✅ Ready |
| More coming... | — | [Contribute!](CONTRIBUTING.md) |

## Installation

```bash
npm install @noelzappy/voltax
```

```bash
pnpm add @noelzappy/voltax
```

```bash
yarn add @noelzappy/voltax
```

## Quick Start

```typescript
import Voltax, { Currency, PaymentStatus } from '@noelzappy/voltax';

// Initialize with your providers
const voltax = new Voltax({
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  },
  flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
  },
  hubtel: {
    clientId: process.env.HUBTEL_CLIENT_ID!,
    clientSecret: process.env.HUBTEL_CLIENT_SECRET!,
    merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT!,
  },
});

// Initialize a payment
const payment = await voltax.paystack.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: `order-${Date.now()}`,
  callbackUrl: 'https://yoursite.com/callback',
});

console.log(payment.authorizationUrl);
// Redirect customer to complete payment

// Verify the payment
const result = await voltax.paystack.verifyTransaction(payment.reference);

if (result.status === PaymentStatus.SUCCESS) {
  console.log('Payment successful!');
}
```

## Standardized API

All providers implement the same interface:

```typescript
interface VoltaxProvider {
  initializePayment(payload: InitiatePaymentDTO): Promise<VoltaxPaymentResponse>;
  verifyTransaction(reference: string): Promise<VoltaxPaymentResponse>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
}
```

### InitiatePaymentDTO

```typescript
{
  amount: number;         // Amount in major units (e.g., 100 for 100 NGN)
  email: string;          // Customer email
  currency: Currency;     // NGN, GHS, USD, KES, ZAR
  reference?: string;     // Your unique transaction reference
  mobileNumber?: string;  // Customer phone number
  description?: string;   // Transaction description
  callbackUrl?: string;   // Redirect URL after payment
  metadata?: object;      // Custom data
  options?: {             // Provider-specific options
    paystack?: PaystackOptions;
    flutterwave?: FlutterwaveOptions;
    hubtel?: HubtelOptions;
  };
}
```

### VoltaxPaymentResponse

```typescript
{
  status: PaymentStatus;      // SUCCESS, PENDING, or FAILED
  reference: string;          // Your transaction reference
  authorizationUrl?: string;  // Checkout URL
  externalReference?: string; // Provider's reference
  raw?: any;                  // Original provider response
}
```

## Error Handling

Voltax provides structured error classes:

```typescript
import {
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
} from '@noelzappy/voltax';

try {
  await voltax.paystack.initializePayment(payload);
} catch (error) {
  if (error instanceof VoltaxValidationError) {
    // Invalid payload - check error.errors for details
    console.error('Validation failed:', error.errors);
  } else if (error instanceof VoltaxGatewayError) {
    // Payment provider returned an error
    console.error('Gateway error:', error.message, error.statusCode);
  } else if (error instanceof VoltaxNetworkError) {
    // Network connectivity issue - safe to retry
    console.error('Network error:', error.message);
  }
}
```

## Provider-Specific Features

### Paystack

```typescript
import { PaystackChannel } from '@noelzappy/voltax';

const payment = await voltax.paystack.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  options: {
    paystack: {
      channels: [PaystackChannel.CARD, PaystackChannel.BANK_TRANSFER],
      subaccount: 'ACCT_xxxxx',
      transactionCharge: 100,
    },
  },
});
```

### Flutterwave

```typescript
const payment = await voltax.flutterwave.initializePayment({
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: 'order-123',  // Required for Flutterwave
  options: {
    flutterwave: {
      customerName: 'John Doe',
      pageTitle: 'My Store',
      logoUrl: 'https://yoursite.com/logo.png',
    },
  },
});
```

### Hubtel

```typescript
const payment = await voltax.hubtel.initializePayment({
  amount: 100,
  email: 'customer@example.com',
  currency: Currency.GHS,
  reference: 'order-123',  // Required
  callbackUrl: 'https://yoursite.com/webhook',  // Required
  options: {
    hubtel: {
      returnUrl: 'https://yoursite.com/success',  // Required
    },
  },
});
```

## Documentation

For complete documentation, visit [voltax.dev](https://voltax.dev)

- [Getting Started](https://voltax.dev/guides/getting-started/)
- [Payment Initialization](https://voltax.dev/guides/payments/)
- [Error Handling](https://voltax.dev/guides/error-handling/)
- [API Reference](https://voltax.dev/reference/)

## Contributing

We welcome contributions! Voltax aims to support all major African payment gateways, and we need your help.

**Gateways we'd love to add:**
- M-Pesa (Kenya)
- OPay (Nigeria)
- Chipper Cash (Pan-African)
- MTN MoMo (Ghana, Uganda)
- Yoco (South Africa)
- And many more!

See [CONTRIBUTING.md](CONTRIBUTING.md) for a complete guide on adding new payment gateways.

```bash
# Clone the repo
git clone https://github.com/noelzappy/voltax.git

# Install dependencies
cd voltax && npm install

# Run tests
cd packages/node && npm test
```

## Monorepo Structure

```
voltax/
├── packages/
│   ├── node/          # Node.js SDK (@noelzappy/voltax)
│   ├── go/            # Go SDK (coming soon)
│   └── php/           # PHP SDK (coming soon)
└── docs/              # Documentation site
```

## License

MIT © [noelzappy](https://github.com/noelzappy)

---

<div align="center">

**Built with ❤️ for African developers**

[⭐ Star us on GitHub](https://github.com/noelzappy/voltax)

</div>
