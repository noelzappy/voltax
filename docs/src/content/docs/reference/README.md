---
editUrl: false
next: false
prev: false
title: "API Reference"
slug: reference
---

This is the complete API reference for `@noelzappy/voltax`. The SDK exports all the classes, interfaces, enums, and utilities you need to integrate African payment gateways.

## Installation

```bash
npm install @noelzappy/voltax
```

## Quick Import Guide

```typescript
// Main class (default export)
import Voltax from '@noelzappy/voltax';

// Named exports - import what you need
import {
  Voltax,
  PaystackAdapter,
  FlutterwaveAdapter,
  HubtelAdapter,
  Currency,
  PaymentStatus,
  PaystackChannel,
  VoltaxError,
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
} from '@noelzappy/voltax';
```

---

## Enumerations

- [Currency](/reference/enumerations/currency/)
- [PaymentStatus](/reference/enumerations/paymentstatus/)
- [PaystackChannel](/reference/enumerations/paystackchannel/)
- [PaymentStatus](/reference/enumerations/paymentstatus/)
- [PaystackChannel](/reference/enumerations/paystackchannel/)

## Classes

- [FlutterwaveAdapter](/reference/classes/flutterwaveadapter/)
- [HubtelAdapter](/reference/classes/hubteladapter/)
- [PaystackAdapter](/reference/classes/paystackadapter/)
- [Voltax](/reference/classes/voltax/)
- [VoltaxError](/reference/classes/voltaxerror/)
- [VoltaxGatewayError](/reference/classes/voltaxgatewayerror/)
- [VoltaxNetworkError](/reference/classes/voltaxnetworkerror/)
- [VoltaxValidationError](/reference/classes/voltaxvalidationerror/)

## Interfaces

- [VoltaxConfig](/reference/interfaces/voltaxconfig/)
- [VoltaxPaymentResponse](/reference/interfaces/voltaxpaymentresponse/)
- [VoltaxProvider](/reference/interfaces/voltaxprovider/)

## Type Aliases

- [InitiatePaymentDTO](/reference/type-aliases/initiatepaymentdto/)

## Variables

- [FlutterwaveOptions](/reference/variables/flutterwaveoptions/)
- [HubtelOptions](/reference/variables/hubteloptions/)
- [InitiatePaymentSchema](/reference/variables/initiatepaymentschema/)
- [PaystackOptions](/reference/variables/paystackoptions/)

## Functions

- [handleGatewayError](/reference/functions/handlegatewayerror/)

## References

### default

Renames and re-exports [Voltax](/reference/classes/voltax/)
