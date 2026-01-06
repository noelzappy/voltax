---
editUrl: false
next: false
prev: false
title: "HubtelAdapter"
---

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:17](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/hubtel/hubtel.adapter.ts#L17)

Interface that all Voltax payment providers must implement.
The generic type TPaymentDTO allows each provider to define its own payment payload type.

## Example

```ts
class PaystackAdapter implements VoltaxProvider<PaystackPaymentDTO> {
  async initiatePayment(payload: PaystackPaymentDTO): Promise<VoltaxPaymentResponse> { ... }
  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> { ... }
  async getPaymentStatus(reference: string): Promise<PaymentStatus> { ... }
}
```

## Implements

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)\<[`HubtelPaymentDTO`](/reference/type-aliases/hubtelpaymentdto/)\>

## Constructors

### Constructor

> **new HubtelAdapter**(`config`): `HubtelAdapter`

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:21](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/hubtel/hubtel.adapter.ts#L21)

#### Parameters

##### config

`HubtelConfig`

#### Returns

`HubtelAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:147](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/hubtel/hubtel.adapter.ts#L147)

Helper to get status directly.

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`getPaymentStatus`](/reference/interfaces/voltaxprovider/#getpaymentstatus)

***

### initiatePayment()

> **initiatePayment**(`payload`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:51](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/hubtel/hubtel.adapter.ts#L51)

Initialize payment with Hubtel's checkout API

#### Parameters

##### payload

Payment details including amount, email, currency, and Hubtel-specific options

###### amount

`number` = `...`

###### callbackUrl

`string` = `...`

###### cancellationUrl?

`string` = `...`

###### currency

[`Currency`](/reference/enumerations/currency/) = `...`

###### description?

`string` = `...`

###### email

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### mobileNumber?

`string` = `...`

###### reference

`string` = `...`

###### returnUrl

`string` = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Promise<VoltaxPaymentResponse>

#### Example

```ts
const hubtel = Voltax('hubtel', { clientId: '...', clientSecret: '...', merchantAccountNumber: '...' });
const response = await hubtel.initiatePayment({
  amount: 100,
  email: 'customer@example.com',
  currency: Currency.GHS,
  reference: 'unique-ref',
  callbackUrl: 'https://example.com/callback',
  // Hubtel-specific options (flat, not nested)
  returnUrl: 'https://example.com/return',
  mobileNumber: '0241234567',
});
```

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initiatePayment`](/reference/interfaces/voltaxprovider/#initiatepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:118](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/hubtel/hubtel.adapter.ts#L118)

Get transaction details.

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`verifyTransaction`](/reference/interfaces/voltaxprovider/#verifytransaction)
