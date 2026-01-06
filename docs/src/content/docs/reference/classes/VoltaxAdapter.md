---
editUrl: false
next: false
prev: false
title: "VoltaxAdapter"
---

Defined in: [packages/node/src/core/voltax.ts:90](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L90)

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

Defined in: [packages/node/src/core/voltax.ts:96](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L96)

#### Parameters

##### config

[`VoltaxMultiConfig`](/reference/interfaces/voltaxmulticonfig/)

#### Returns

`VoltaxAdapter`

## Accessors

### flutterwave

#### Get Signature

> **get** **flutterwave**(): [`FlutterwaveAdapter`](/reference/classes/flutterwaveadapter/)

Defined in: [packages/node/src/core/voltax.ts:137](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L137)

Get Flutterwave provider instance

##### Returns

[`FlutterwaveAdapter`](/reference/classes/flutterwaveadapter/)

***

### hubtel

#### Get Signature

> **get** **hubtel**(): [`HubtelAdapter`](/reference/classes/hubteladapter/)

Defined in: [packages/node/src/core/voltax.ts:119](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L119)

Get Hubtel provider instance

##### Returns

[`HubtelAdapter`](/reference/classes/hubteladapter/)

***

### moolre

#### Get Signature

> **get** **moolre**(): [`MoolreAdapter`](/reference/classes/moolreadapter/)

Defined in: [packages/node/src/core/voltax.ts:155](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L155)

Get Moolre provider instance

##### Returns

[`MoolreAdapter`](/reference/classes/moolreadapter/)

***

### paystack

#### Get Signature

> **get** **paystack**(): [`PaystackAdapter`](/reference/classes/paystackadapter/)

Defined in: [packages/node/src/core/voltax.ts:101](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/voltax.ts#L101)

Get Paystack provider instance

##### Returns

[`PaystackAdapter`](/reference/classes/paystackadapter/)
