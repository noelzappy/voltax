# Contributing to Voltax

First off, thank you for considering contributing to Voltax! 🎉 

Voltax aims to be the most comprehensive payment SDK for Africa, and we need your help to make that happen. Whether you're fixing a bug, adding a new payment gateway, or improving documentation, your contribution is valuable.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Adding a New Payment Gateway](#adding-a-new-payment-gateway)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and inclusive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/voltax.git
   cd voltax
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/noelzappy/voltax.git
   ```

## Development Setup

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# Install root dependencies
npm install

# Install package dependencies
cd packages/node
npm install

# Run tests to verify setup
npm test

# Build the package
npm run build
```

### Project Structure

```
voltax/
├── packages/
│   └── node/                    # Node.js SDK
│       ├── src/
│       │   ├── core/            # Core classes and interfaces
│       │   │   ├── enums.ts     # Currency, PaymentStatus enums
│       │   │   ├── errors.ts    # Error classes
│       │   │   ├── interfaces.ts # VoltaxProvider interface
│       │   │   ├── schemas.ts   # Zod validation schemas
│       │   │   └── voltax.ts    # Main Voltax class
│       │   ├── providers/       # Payment gateway adapters
│       │   │   ├── paystack/
│       │   │   ├── flutterwave/
│       │   │   └── hubtel/
│       │   └── index.ts         # Public exports
│       └── package.json
└── docs/                        # Documentation site
```

## Adding a New Payment Gateway

We especially encourage contributions that add support for new African payment gateways! Here's how to add one:

### Step 1: Create the Provider Directory

```bash
mkdir -p packages/node/src/providers/YOUR_GATEWAY
```

### Step 2: Create the Types File

Create `types.ts` with your gateway-specific types:

```typescript
// packages/node/src/providers/YOUR_GATEWAY/types.ts

import { z } from "zod";

// Configuration schema
export const YourGatewayOptionsSchema = z.object({
  // Add gateway-specific payment options
  customField: z.string().optional(),
});

export type YourGatewayOptions = z.infer<typeof YourGatewayOptionsSchema>;

// Configuration for initialization
export interface YourGatewayConfig {
  secretKey: string;
  // Add other required credentials
}

// API response types (from the gateway's API)
export interface YourGatewayInitResponse {
  // Map to the actual API response structure
}

export interface YourGatewayVerifyResponse {
  // Map to the actual API response structure
}
```

### Step 3: Create the Adapter

Create the adapter that implements `VoltaxProvider`:

```typescript
// packages/node/src/providers/YOUR_GATEWAY/your_gateway.adapter.ts

import axios, { AxiosInstance } from "axios";
import { PaymentStatus } from "../../core/enums.js";
import { VoltaxGatewayError, VoltaxNetworkError } from "../../core/errors.js";
import { VoltaxPaymentResponse, VoltaxProvider } from "../../core/interfaces.js";
import { InitiatePaymentDTO } from "../../core/schemas.js";
import { handleGatewayError } from "../../core/utils.js";
import { YourGatewayConfig } from "./types.js";

export class YourGatewayAdapter implements VoltaxProvider {
  private client: AxiosInstance;

  constructor(private config: YourGatewayConfig) {
    this.client = axios.create({
      baseURL: "https://api.yourgateway.com",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async initializePayment(payload: InitiatePaymentDTO): Promise<VoltaxPaymentResponse> {
    try {
      // Transform payload to gateway format
      const gatewayPayload = {
        amount: payload.amount * 100, // Convert to minor units if needed
        email: payload.email,
        currency: payload.currency,
        reference: payload.reference,
        // Map other fields...
      };

      const response = await this.client.post("/transaction/initialize", gatewayPayload);

      // Transform response to VoltaxPaymentResponse
      return {
        status: PaymentStatus.PENDING,
        reference: payload.reference || response.data.reference,
        authorizationUrl: response.data.authorization_url,
        externalReference: response.data.reference,
        raw: response.data,
      };
    } catch (error) {
      throw handleGatewayError(error);
    }
  }

  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    try {
      const response = await this.client.get(`/transaction/verify/${reference}`);

      return {
        status: this.mapStatus(response.data.status),
        reference,
        externalReference: response.data.id,
        raw: response.data,
      };
    } catch (error) {
      throw handleGatewayError(error);
    }
  }

  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    const result = await this.verifyTransaction(reference);
    return result.status;
  }

  private mapStatus(gatewayStatus: string): PaymentStatus {
    // Map gateway-specific statuses to Voltax statuses
    const statusMap: Record<string, PaymentStatus> = {
      success: PaymentStatus.SUCCESS,
      completed: PaymentStatus.SUCCESS,
      failed: PaymentStatus.FAILED,
      cancelled: PaymentStatus.FAILED,
      pending: PaymentStatus.PENDING,
    };
    return statusMap[gatewayStatus.toLowerCase()] || PaymentStatus.PENDING;
  }
}
```

### Step 4: Add Tests

Create comprehensive tests:

```typescript
// packages/node/src/providers/YOUR_GATEWAY/your_gateway.adapter.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { YourGatewayAdapter } from "./your_gateway.adapter.js";
import { Currency, PaymentStatus } from "../../core/enums.js";

describe("YourGatewayAdapter", () => {
  let adapter: YourGatewayAdapter;

  beforeEach(() => {
    adapter = new YourGatewayAdapter({
      secretKey: "test_secret_key",
    });
  });

  describe("initializePayment", () => {
    it("should initialize payment successfully", async () => {
      // Mock axios and test the flow
    });

    it("should handle validation errors", async () => {
      // Test error handling
    });
  });

  describe("verifyTransaction", () => {
    it("should verify successful transaction", async () => {
      // Test verification
    });
  });
});
```

### Step 5: Export the Adapter

Add exports to `packages/node/src/index.ts`:

```typescript
// Add to exports
export { YourGatewayAdapter } from "./providers/YOUR_GATEWAY/your_gateway.adapter.js";
export { YourGatewayOptions } from "./providers/YOUR_GATEWAY/types.js";
```

### Step 6: Integrate with Voltax Class

Update `packages/node/src/core/voltax.ts` to include your gateway:

```typescript
// Add to VoltaxConfig interface
yourgateway?: YourGatewayConfig;

// Add to Voltax class
public yourgateway?: YourGatewayAdapter;

// In constructor
if (config.yourgateway) {
  this.yourgateway = new YourGatewayAdapter(config.yourgateway);
}
```

### Step 7: Add Documentation

Create a guide in `docs/src/content/docs/guides/your-gateway.mdx` following the pattern of existing guides.

## Coding Guidelines

### TypeScript

- Use strict TypeScript - no `any` types unless absolutely necessary
- Export interfaces for all public types
- Use Zod for runtime validation of external data

### Code Style

- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### File Naming

- Use kebab-case for files: `your-gateway.adapter.ts`
- Use PascalCase for classes: `YourGatewayAdapter`
- Use camelCase for functions and variables

### Error Handling

- Use the existing error classes: `VoltaxValidationError`, `VoltaxGatewayError`, `VoltaxNetworkError`
- Always catch and transform errors appropriately
- Include helpful error messages

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests for a specific file
npm test -- your_gateway.adapter.test.ts

# Run with coverage
npm test -- --coverage
```

### Testing Guidelines

- Write tests for all public methods
- Mock external API calls
- Test both success and error paths
- Aim for >80% code coverage on new code

## Submitting a Pull Request

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/add-gateway-name
   ```

2. **Make your changes** following the guidelines above

3. **Write/update tests** for your changes

4. **Run the test suite**:
   ```bash
   npm test
   ```

5. **Lint and format**:
   ```bash
   npm run lint
   npm run format
   ```

6. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "feat: add support for GatewayName"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/add-gateway-name
   ```

8. **Open a Pull Request** on GitHub

### PR Title Format

Use conventional commits format:
- `feat: add support for NewGateway`
- `fix: correct amount conversion for Paystack`
- `docs: update Hubtel integration guide`
- `chore: update dependencies`

## Reporting Issues

When reporting issues, please include:

1. **Description** of the issue
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Environment** (Node.js version, OS, etc.)
6. **Code sample** if applicable

## Payment Gateways We'd Love to See

Here are some African payment gateways we'd love to add support for:

### West Africa
- [ ] **Chipper Cash** - Pan-African
- [ ] **OPay** - Nigeria
- [ ] **Kuda** - Nigeria
- [ ] **Moniepoint** - Nigeria
- [ ] **Squad** - Nigeria
- [ ] **Seerbit** - Nigeria
- [ ] **Interswitch** - Nigeria
- [ ] **MTN MoMo API** - Ghana, Uganda, etc.

### East Africa
- [ ] **M-Pesa (Safaricom)** - Kenya
- [ ] **Cellulant** - Pan-African
- [ ] **DPO Group** - Pan-African
- [ ] **Pesapal** - Kenya, Uganda, Tanzania
- [ ] **IntaSend** - Kenya
- [ ] **Kopokopo** - Kenya

### Southern Africa
- [ ] **Yoco** - South Africa
- [ ] **Peach Payments** - South Africa
- [ ] **PayFast** - South Africa
- [ ] **iKhokha** - South Africa
- [ ] **Ozow** - South Africa

### North Africa
- [ ] **Fawry** - Egypt
- [ ] **Paymob** - Egypt
- [ ] **Kashier** - Egypt
- [ ] **CMI** - Morocco

Pick one and submit a PR! We'll help you through the process.

## Questions?

Feel free to open an issue or start a discussion if you have any questions. We're here to help!

Thank you for contributing to Voltax! 🚀
