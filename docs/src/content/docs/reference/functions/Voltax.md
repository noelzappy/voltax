---
editUrl: false
next: false
prev: false
title: "Voltax"
---

> **Voltax**\<`T`\>(`provider`, `config`): [`VoltaxAdapterMap`](/reference/interfaces/voltaxadaptermap/)\[`T`\]

Defined in: [packages/node/src/core/voltax.ts:62](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L62)

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
