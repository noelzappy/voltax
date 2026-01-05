# @noelzappy/voltax

> The Unified Payment SDK for Africa.

**Voltax** unifies fragmented African payment gateways (Paystack, Hubtel, Flutterwave, etc.) into a single, standardized, and strictly typed API. Build faster, switch providers easily, and maintain less code.

## Features

- 🛡 **Strictly Typed**: Built with TypeScript + Zod for runtime validation.
- 🔗 **Standardized API**: One interface (`VoltaxProvider`) for all gateways.
- 🔄 **Adapter Pattern**: Swap providers without rewriting business logic.
- ⚡ **Lightweight**: Tree-shakeable, ESM & CJS support.
- 🔒 **Secure**: No hardcoded keys, enforced checks.

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

## Documentation

For full documentation, visit [voltax.noelzappy.dev](https://voltax.noelzappy.dev).

## License

MIT © [noelzappy](https://github.com/noelzappy)
