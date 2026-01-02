---
title: Error Handling
description: Learn how to handle errors gracefully when using Voltax.
---

import { Aside, Tabs, TabItem } from '@astrojs/starlight/components';

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
import { VoltaxError } from 'voltax-node';

try {
  await voltax.paystack.initializePayment(payload);
} catch (error) {
  if (error instanceof VoltaxError) {
    console.error('Voltax error:', error.message);
  }
}
```

### VoltaxValidationError

Thrown when input validation fails. This includes invalid email addresses, unsupported currencies, missing required fields, or invalid amounts.

```typescript
import { VoltaxValidationError } from 'voltax-node';

try {
  await voltax.paystack.initializePayment({
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
import { VoltaxGatewayError } from 'voltax-node';

try {
  await voltax.paystack.verifyTransaction('invalid-reference');
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
import { VoltaxNetworkError } from 'voltax-node';

try {
  await voltax.paystack.initializePayment(payload);
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
import {
  Voltax,
  Currency,
  PaymentStatus,
  VoltaxError,
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
} from 'voltax-node';

async function processPayment(payload: InitiatePaymentDTO) {
  const voltax = new Voltax({
    paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
  });

  try {
    const response = await voltax.paystack.initializePayment(payload);
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
async function initializeWithRetry(
  voltax: Voltax,
  payload: InitiatePaymentDTO,
  maxRetries = 3
) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await voltax.paystack.initializePayment(payload);
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
async function initializeWithFailover(
  voltax: Voltax,
  payload: InitiatePaymentDTO
) {
  // Try primary provider
  try {
    return await voltax.paystack.initializePayment(payload);
  } catch (error) {
    if (error instanceof VoltaxGatewayError || error instanceof VoltaxNetworkError) {
      console.warn('Primary provider failed, trying backup...');
      
      // Failover to backup provider
      try {
        return await voltax.flutterwave.initializePayment({
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

### Express.js Error Handler

```typescript
import express from 'express';
import {
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
} from 'voltax-node';

const app = express();

// Voltax error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof VoltaxValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors,
    });
  }

  if (err instanceof VoltaxGatewayError) {
    // Log for monitoring
    console.error('Gateway error:', {
      provider: err.provider,
      statusCode: err.statusCode,
      data: err.data,
    });

    return res.status(502).json({
      error: 'Payment Gateway Error',
      message: 'Unable to process payment. Please try again.',
    });
  }

  if (err instanceof VoltaxNetworkError) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Payment service is temporarily unavailable.',
      retryAfter: 30,
    });
  }

  next(err);
});
```

## Configuration Errors

When accessing a provider that hasn't been configured, Voltax throws a `VoltaxValidationError`:

```typescript
const voltax = new Voltax({
  paystack: { secretKey: 'sk_xxx' },
  // Flutterwave not configured
});

try {
  // This will throw because Flutterwave is not configured
  await voltax.flutterwave.initializePayment(payload);
} catch (error) {
  if (error instanceof VoltaxValidationError) {
    console.error(error.message);
    // "Flutterwave configuration is missing. Please provide "flutterwave" in the Voltax constructor."
  }
}
```

<Aside type="tip" title="Best Practice">
  Always configure only the providers you need. Accessing an unconfigured provider will throw immediately, making it easy to catch configuration issues during development.
</Aside>

## The handleGatewayError Function

For advanced users, Voltax exports the `handleGatewayError` utility function used internally to process Axios errors:

```typescript
import { handleGatewayError } from 'voltax-node';

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
