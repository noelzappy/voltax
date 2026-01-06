---
editUrl: false
next: false
prev: false
title: "MoolreAdapter"
---

Defined in: [packages/node/src/providers/moolre/moolre.adapter.ts:17](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/moolre/moolre.adapter.ts#L17)

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

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)\<[`MoolrePaymentDTO`](/reference/type-aliases/moolrepaymentdto/)\>

## Constructors

### Constructor

> **new MoolreAdapter**(`__namedParameters`): `MoolreAdapter`

Defined in: [packages/node/src/providers/moolre/moolre.adapter.ts:21](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/moolre/moolre.adapter.ts#L21)

#### Parameters

##### \_\_namedParameters

`MoolreAdapterOptions`

#### Returns

`MoolreAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/moolre/moolre.adapter.ts:121](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/moolre/moolre.adapter.ts#L121)

Gets the status of a payment.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

The payment status

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`getPaymentStatus`](/reference/interfaces/voltaxprovider/#getpaymentstatus)

***

### initiatePayment()

> **initiatePayment**(`payload`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/moolre/moolre.adapter.ts:53](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/moolre/moolre.adapter.ts#L53)

Initiate a payment with Moolre

#### Parameters

##### payload

Payment details including amount, email, currency, and Moolre-specific options

###### accountNumberOverride?

`string` = `...`

###### amount

`number` = `...`

###### callbackUrl

`string` = `...`

###### currency

[`Currency`](/reference/enumerations/currency/) = `...`

###### description?

`string` = `...`

###### email

`string` = `...`

###### linkReusable?

`boolean` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### redirectUrl

`string` = `...`

###### reference

`string` = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Promise<VoltaxPaymentResponse>

#### Example

```ts
const moolre = Voltax('moolre', { apiUser: '...', accountNumber: '...', apiPublicKey: '...' });
const response = await moolre.initiatePayment({
  amount: 100,
  email: 'customer@example.com',
  currency: Currency.GHS,
  reference: 'unique-ref',
  callbackUrl: 'https://example.com/callback',
  // Moolre-specific options (flat, not nested)
  redirectUrl: 'https://example.com/redirect',
  linkReusable: false,
});
```

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initiatePayment`](/reference/interfaces/voltaxprovider/#initiatepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/moolre/moolre.adapter.ts:96](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/moolre/moolre.adapter.ts#L96)

Verifies a transaction by its reference.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

A standardized payment response with updated status

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`verifyTransaction`](/reference/interfaces/voltaxprovider/#verifytransaction)
