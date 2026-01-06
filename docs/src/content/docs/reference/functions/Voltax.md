---
editUrl: false
next: false
prev: false
title: "Voltax"
---

> **Voltax**\<`T`\>(`provider`, `config`): [`VoltaxAdapterMap`](/reference/interfaces/voltaxadaptermap/)\[`T`\]

Defined in: [packages/node/src/core/voltax.ts:57](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L57)

Create a Voltax payment provider instance

## Type Parameters

### T

`T` *extends* [`VoltaxProviders`](/reference/type-aliases/voltaxproviders/)

## Parameters

### provider

`T`

### config

[`VoltaxConfigMap`](/reference/interfaces/voltaxconfigmap/)\[`T`\]

## Returns

[`VoltaxAdapterMap`](/reference/interfaces/voltaxadaptermap/)\[`T`\]

## Example

```ts
const hubtel = Voltax('hubtel', { clientId: '...', clientSecret: '...', merchantAccountNumber: '...' });
const paystack = Voltax('paystack', { secretKey: '...' });

await hubtel.initiatePayment({ amount: 100, ... });
```
