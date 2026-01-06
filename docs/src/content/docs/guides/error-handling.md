---
title: Error Handling
description: Learn how to handle errors gracefully when using Voltax.
---

Voltax provides a comprehensive error handling system with specific error classes for different failure scenarios. This guide explains each error type and how to handle them effectively.

## Error Hierarchy

All Voltax errors extend from the base `VoltaxError` class:

```
VoltaxError (base class)
├── VoltaxValidationError  - Input validation failures
├── VoltaxGatewayError     - Payment provider API errors
└── VoltaxNetworkError     - Network/connectivity issues
```

## Error Classes

### VoltaxError

The base error class for all Voltax-related errors.

```typescript
import { VoltaxError } from '@noelzappy/voltax';

try {
  await paystack.initiatePayment(payload);
} catch (error) {
  if (error instanceof VoltaxError) {
    console.error('Voltax error:', error.message);
  }
}
```

### VoltaxValidationError

Thrown when input validation fails. This includes invalid email addresses, unsupported currencies, missing required fields, or invalid amounts.

```typescript
import Voltax, { VoltaxValidationError, Currency } from '@noelzappy/voltax';

const paystack = Voltax('paystack', {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});

try {
  await paystack.initiatePayment({
    amount: -100,  // Invalid: negative amount
    email: 'invalid-email',  // Invalid: not a valid email
    currency: Currency.NGN,
  });
} catch (error) {
  if (error instanceof VoltaxValidationError) {
    console.error('Validation failed:', error.message);
    
    // Access detailed Zod validation errors
    if (error.errors) {
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    }
  }
}
```

**Properties:**
- `message`: Human-readable error description
- `errors?`: Array of detailed validation errors (from Zod)

**Common Causes:**
- Invalid or missing email address
- Negative or zero amount
- Unsupported currency
- Missing required fields (e.g., reference for Flutterwave/Hubtel)
- Invalid URL format for callback URLs
- Invalid mobile number format

### VoltaxGatewayError

Thrown when the payment provider's API returns an error response (e.g., invalid API key, transaction not found, insufficient funds).

```typescript
import { VoltaxGatewayError } from '@noelzappy/voltax';

try {
  await paystack.verifyTransaction('invalid-reference');
} catch (error) {
  if (error instanceof VoltaxGatewayError) {
    console.error('Gateway error:', error.message);
    console.error('Provider:', error.provider);
    console.error('Status code:', error.statusCode);
    console.error('Response data:', error.data);
  }
}
```

**Properties:**
- `message`: Error message from the provider
- `provider`: Name of the provider (e.g., "Paystack", "Flutterwave", "Hubtel")
- `statusCode?`: HTTP status code (e.g., 400, 401, 404)
- `data?`: Raw error response from the provider

**Common Causes:**
- Invalid API key or credentials
- Transaction not found
- Duplicate transaction reference
- Invalid transaction state
- Account issues (suspended, etc.)

### VoltaxNetworkError

Thrown when the network request fails due to connectivity issues, timeouts, or DNS errors.

```typescript
import { VoltaxNetworkError } from '@noelzappy/voltax';

try {
  await paystack.initiatePayment(payload);
} catch (error) {
  if (error instanceof VoltaxNetworkError) {
    console.error('Network error:', error.message);
    
    // Access the original error for debugging
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
  }
}
```

**Properties:**
- `message`: Description of the network failure
- `originalError?`: The underlying error (e.g., Axios error)

**Common Causes:**
- Network timeout (default: 10 seconds)
- DNS resolution failures
- Connection refused
- SSL/TLS errors
- No internet connection

## Comprehensive Error Handling

Here's a complete example of handling all error types:

```typescript
import Voltax, {
  Currency,
  PaymentStatus,
  VoltaxError,
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
} from '@noelzappy/voltax';
import type { PaystackPaymentDTO } from '@noelzappy/voltax';

async function processPayment(payload: PaystackPaymentDTO) {
  const paystack = Voltax('paystack', {
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  });

  try {
    const response = await paystack.initiatePayment(payload);
    return {
      success: true,
      checkoutUrl: response.authorizationUrl,
      reference: response.reference,
    };
  } catch (error) {
    // Handle validation errors (client-side issues)
    if (error instanceof VoltaxValidationError) {
      return {
        success: false,
        errorType: 'VALIDATION_ERROR',
        message: error.message,
        details: error.errors,
        // Suggest fixes to the user
        suggestion: 'Please check your input and try again.',
      };
    }

    // Handle gateway errors (provider-side issues)
    if (error instanceof VoltaxGatewayError) {
      console.error(`[${error.provider}] Gateway error:`, {
        statusCode: error.statusCode,
        data: error.data,
      });

      // Handle specific status codes
      if (error.statusCode === 401) {
        return {
          success: false,
          errorType: 'AUTHENTICATION_ERROR',
          message: 'Payment service configuration error',
          suggestion: 'Please contact support.',
        };
      }

      return {
        success: false,
        errorType: 'GATEWAY_ERROR',
        message: 'Payment provider error. Please try again.',
        provider: error.provider,
      };
    }

    // Handle network errors (connectivity issues)
    if (error instanceof VoltaxNetworkError) {
      console.error('Network error:', error.originalError);
      
      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: 'Unable to connect to payment service.',
        suggestion: 'Please check your connection and try again.',
        retryable: true,
      };
    }

    // Handle unexpected errors
    if (error instanceof VoltaxError) {
      console.error('Unexpected Voltax error:', error);
      return {
        success: false,
        errorType: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.',
      };
    }

    // Re-throw non-Voltax errors
    throw error;
  }
}
```

## Error Handling Patterns

### Retry Pattern for Network Errors

```typescript
import { Voltax, VoltaxNetworkError } from '@noelzappy/voltax';
import type { PaystackPaymentDTO } from '@noelzappy/voltax';

const paystack = Voltax('paystack', {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});

async function initiateWithRetry(
  payload: PaystackPaymentDTO,
  maxRetries = 3
) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await paystack.initiatePayment(payload);
    } catch (error) {
      if (error instanceof VoltaxNetworkError) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed, retrying...`);
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        continue;
      }
      // Don't retry non-network errors
      throw error;
    }
  }

  throw lastError;
}
```

### Provider Failover Pattern

```typescript
import { VoltaxAdapter, VoltaxGatewayError, VoltaxNetworkError, Currency } from '@noelzappy/voltax';

const voltax = new VoltaxAdapter({
  paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
  flutterwave: { secretKey: process.env.FLUTTERWAVE_SECRET_KEY! },
});

async function initiateWithFailover(payload: {
  amount: number;
  email: string;
  currency: Currency;
  reference?: string;
}) {
  // Try primary provider
  try {
    return await voltax.paystack.initiatePayment(payload);
  } catch (error) {
    if (error instanceof VoltaxGatewayError || error instanceof VoltaxNetworkError) {
      console.warn('Primary provider failed, trying backup...');
      
      // Failover to backup provider
      try {
        return await voltax.flutterwave.initiatePayment({
          ...payload,
          reference: payload.reference || `fallback-${Date.now()}`,
        });
      } catch (backupError) {
        // Both providers failed
        throw new Error('All payment providers are currently unavailable');
      }
    }
    throw error;
  }
}
```

## Configuration Errors

When using `VoltaxAdapter` with an unconfigured provider, Voltax will have an undefined adapter for that provider:

```typescript
import { VoltaxAdapter } from '@noelzappy/voltax';

const voltax = new VoltaxAdapter({
  paystack: { secretKey: 'sk_xxx' },
  // Flutterwave not configured
});

// voltax.flutterwave is undefined
if (!voltax.flutterwave) {
  console.error('Flutterwave is not configured');
}
```

<Aside type="tip" title="Best Practice">
  Use the `Voltax()` factory function for single providers to get full type safety. Use `VoltaxAdapter` only when you need multiple providers, and always check if the provider is configured before using it.
</Aside>

## The handleGatewayError Function

For advanced users, Voltax exports the `handleGatewayError` utility function used internally to process Axios errors:

```typescript
import { handleGatewayError } from '@noelzappy/voltax';

// This function always throws - it transforms errors and re-throws them
try {
  await someAxiosCall();
} catch (error) {
  handleGatewayError(error, 'CustomProvider'); // Always throws
}
```

<Aside type="caution">
  The `handleGatewayError` function always throws and never returns normally. It's primarily intended for internal use and custom adapter implementations.
</Aside>

## Next Steps

- Return to the [Getting Started](/guides/getting-started/) guide
- Learn about [Initializing Payments](/guides/payments/)
- Explore provider-specific guides:
  - [Paystack Guide](/guides/paystack/)
  - [Flutterwave Guide](/guides/flutterwave/)
  - [Hubtel Guide](/guides/hubtel/)
