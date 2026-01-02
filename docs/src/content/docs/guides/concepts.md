---
title: Core Concepts
description: Understand the architecture and design principles behind Voltax.
---

import { Aside, Card, CardGrid } from '@astrojs/starlight/components';

This guide explains the key concepts and architecture behind Voltax to help you understand how the SDK works and how to use it effectively.

## The Problem

Building payment integrations across Africa means dealing with multiple providers:

- **Paystack** for Nigeria, Ghana, South Africa, Kenya
- **Flutterwave** for 30+ African countries
- **Hubtel** for Ghana-specific mobile money

Each provider has:
- Different API structures and authentication methods
- Different request/response formats
- Different error handling patterns
- Different status values and meanings

This leads to fragmented codebases with provider-specific logic scattered throughout your application.

## The Solution: Unified API

Voltax solves this with three key design patterns:

### 1. Adapter Pattern

Each payment provider has its own adapter class that implements a common interface (`VoltaxProvider`):

```typescript
interface VoltaxProvider {
  initializePayment(payload: InitiatePaymentDTO): Promise<VoltaxPaymentResponse>;
  verifyTransaction(reference: string): Promise<VoltaxPaymentResponse>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
}
```

This means:
- All providers have the same methods
- All providers accept the same payload structure
- All providers return the same response format

### 2. Standardized Data Types

Voltax normalizes provider-specific values to standard types:

**Payment Status:**
```typescript
enum PaymentStatus {
  SUCCESS = 'SUCCESS',   // Payment completed
  PENDING = 'PENDING',   // Payment processing
  FAILED = 'FAILED',     // Payment failed
}
```

**Currencies:**
```typescript
enum Currency {
  GHS = 'GHS',  // Ghanaian Cedi
  NGN = 'NGN',  // Nigerian Naira
  USD = 'USD',  // US Dollar
  KES = 'KES',  // Kenyan Shilling
  ZAR = 'ZAR',  // South African Rand
}
```

### 3. Runtime Validation with Zod

All payment payloads are validated at runtime using Zod schemas:

```typescript
const InitiatePaymentSchema = z.object({
  amount: z.number().positive(),
  email: z.string().email(),
  currency: z.nativeEnum(Currency),
  // ...
});
```

This catches errors early with descriptive messages, before making API calls.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      Voltax SDK                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  Voltax Class                     │   │
│  │   .paystack  .flutterwave  .hubtel               │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────┼──────────────────────────┐    │
│  │                      ▼                           │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐      │    │
│  │  │ Paystack  │ │Flutterwave│ │  Hubtel   │      │    │
│  │  │ Adapter   │ │  Adapter  │ │  Adapter  │      │    │
│  │  └───────────┘ └───────────┘ └───────────┘      │    │
│  │        All implement VoltaxProvider              │    │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │             Shared Components                     │   │
│  │  • Zod Schemas (validation)                      │   │
│  │  • Error Classes (VoltaxError hierarchy)         │   │
│  │  • Enums (Currency, PaymentStatus, etc.)        │   │
│  │  • Interfaces (VoltaxPaymentResponse, etc.)     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────┬──────────────────┬───────────────────┐
│ Paystack API     │ Flutterwave API  │ Hubtel API        │
│ api.paystack.co  │ api.flutterwave. │ payproxyapi.      │
│                  │ com              │ hubtel.com        │
└──────────────────┴──────────────────┴───────────────────┘
```

## Key Components

<CardGrid>
  <Card title="Voltax Class" icon="rocket">
    The main entry point. Provides lazy-loaded access to provider adapters via getters.
  </Card>
  <Card title="Provider Adapters" icon="puzzle">
    Implementation classes that handle provider-specific API communication and response mapping.
  </Card>
  <Card title="VoltaxProvider Interface" icon="document">
    The contract all adapters implement, ensuring consistent API across providers.
  </Card>
  <Card title="Error Classes" icon="warning">
    Typed error hierarchy for handling validation, gateway, and network errors.
  </Card>
</CardGrid>

## Lazy Initialization

Provider adapters are created lazily when first accessed:

```typescript
const voltax = new Voltax({
  paystack: { secretKey: 'sk_xxx' },
  flutterwave: { secretKey: 'sk_xxx' },
});

// PaystackAdapter is created here (first access)
const payment1 = await voltax.paystack.initializePayment(...);

// Same instance is reused
const payment2 = await voltax.paystack.initializePayment(...);
```

This means:
- Only configured providers can be accessed
- Adapters are only instantiated when needed
- The same adapter instance is reused for all calls

## Amount Handling

Different providers expect amounts in different units:

| Provider | Expected Format |
|----------|----------------|
| Paystack | Minor units (kobo for NGN) |
| Flutterwave | Major units |
| Hubtel | Major units |

Voltax handles this automatically:

```typescript
// You always provide major units
const payment = await voltax.paystack.initializePayment({
  amount: 5000,  // 5000 NGN
  // Voltax converts to 500000 kobo internally
});
```

## Error Handling Philosophy

Voltax categorizes errors into three types:

1. **Validation Errors** (`VoltaxValidationError`)
   - Your code provided invalid input
   - Fix your payload and retry

2. **Gateway Errors** (`VoltaxGatewayError`)
   - Provider rejected the request
   - Check credentials, transaction state, etc.

3. **Network Errors** (`VoltaxNetworkError`)
   - Connectivity issues
   - Safe to retry with backoff

```typescript
try {
  await voltax.paystack.initializePayment(payload);
} catch (error) {
  if (error instanceof VoltaxValidationError) {
    // Fix payload and retry
  } else if (error instanceof VoltaxGatewayError) {
    // Log and investigate
  } else if (error instanceof VoltaxNetworkError) {
    // Retry with backoff
  }
}
```

## Provider-Specific Options

While the core payload is standardized, each provider has unique features accessible via `options`:

```typescript
const payment = await voltax.paystack.initializePayment({
  // Standard fields (work across all providers)
  amount: 5000,
  email: 'customer@example.com',
  currency: Currency.NGN,
  
  // Provider-specific options
  options: {
    paystack: {
      channels: [PaystackChannel.CARD],
      subaccount: 'ACCT_xxx',
    },
  },
});
```

This design allows:
- Core logic remains provider-agnostic
- Advanced provider features are still accessible
- Easy switching between providers for basic use cases

## Best Practices

<Aside type="tip" title="Use Environment Variables">
  Never hardcode API keys. Use environment variables for all credentials.
</Aside>

<Aside type="tip" title="Generate Unique References">
  Always generate unique transaction references to avoid duplicate payments.
</Aside>

<Aside type="tip" title="Always Verify Server-Side">
  Never trust callback parameters alone. Always verify transactions on your server.
</Aside>

<Aside type="tip" title="Handle All Error Types">
  Implement proper error handling for validation, gateway, and network errors.
</Aside>

## Next Steps

- [Getting Started](/guides/getting-started/) - Install and configure Voltax
- [Initializing Payments](/guides/payments/) - Learn the payment flow
- [Error Handling](/guides/error-handling/) - Handle errors gracefully
- [API Reference](/reference/) - Explore all classes and interfaces
