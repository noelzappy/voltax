---
editUrl: false
next: false
prev: false
title: "VoltaxAdapter"
---

Defined in: [packages/node/src/core/voltax.ts:97](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L97)

Multi-provider adapter for managing multiple payment gateways

## Example

```ts
const voltax = new VoltaxAdapter({
  hubtel: { clientId: '...', clientSecret: '...', merchantAccountNumber: '...' },
  paystack: { secretKey: '...' }
});

await voltax.hubtel.initiatePayment({ amount: 100, ... });
await voltax.paystack.initiatePayment({ amount: 100, ... });
```

## Constructors

### Constructor

> **new VoltaxAdapter**(`config`): `VoltaxAdapter`

Defined in: [packages/node/src/core/voltax.ts:104](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L104)

#### Parameters

##### config

[`VoltaxMultiConfig`](/reference/interfaces/voltaxmulticonfig/)

#### Returns

`VoltaxAdapter`

## Accessors

### flutterwave

#### Get Signature

> **get** **flutterwave**(): [`FlutterwaveAdapter`](/reference/classes/flutterwaveadapter/)

Defined in: [packages/node/src/core/voltax.ts:145](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L145)

Get Flutterwave provider instance

##### Returns

[`FlutterwaveAdapter`](/reference/classes/flutterwaveadapter/)

***

### hubtel

#### Get Signature

> **get** **hubtel**(): [`HubtelAdapter`](/reference/classes/hubteladapter/)

Defined in: [packages/node/src/core/voltax.ts:127](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L127)

Get Hubtel provider instance

##### Returns

[`HubtelAdapter`](/reference/classes/hubteladapter/)

***

### libertepay

#### Get Signature

> **get** **libertepay**(): [`LibertePayAdapter`](/reference/classes/libertepayadapter/)

Defined in: [packages/node/src/core/voltax.ts:181](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L181)

Get LibertePay provider instance

##### Returns

[`LibertePayAdapter`](/reference/classes/libertepayadapter/)

***

### moolre

#### Get Signature

> **get** **moolre**(): [`MoolreAdapter`](/reference/classes/moolreadapter/)

Defined in: [packages/node/src/core/voltax.ts:163](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L163)

Get Moolre provider instance

##### Returns

[`MoolreAdapter`](/reference/classes/moolreadapter/)

***

### paystack

#### Get Signature

> **get** **paystack**(): [`PaystackAdapter`](/reference/classes/paystackadapter/)

Defined in: [packages/node/src/core/voltax.ts:109](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/voltax.ts#L109)

Get Paystack provider instance

##### Returns

[`PaystackAdapter`](/reference/classes/paystackadapter/)
