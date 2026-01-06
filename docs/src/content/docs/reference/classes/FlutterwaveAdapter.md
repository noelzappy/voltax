---
editUrl: false
next: false
prev: false
title: "FlutterwaveAdapter"
---

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:11](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L11)

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

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)\<[`FlutterwavePaymentDTO`](/reference/type-aliases/flutterwavepaymentdto/)\>

## Constructors

### Constructor

> **new FlutterwaveAdapter**(`__namedParameters`): `FlutterwaveAdapter`

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:14](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L14)

#### Parameters

##### \_\_namedParameters

`FlutterwaveConfig`

#### Returns

`FlutterwaveAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:146](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L146)

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

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:49](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L49)

Initiate a payment with Flutterwave

#### Parameters

##### payload

Payment details including amount, email, currency, and Flutterwave-specific options

###### amount

`number` = `...`

###### callbackUrl?

`string` = `...`

###### currency

[`Currency`](/reference/enumerations/currency/) = `...`

###### customerName?

`string` = `...`

###### description?

`string` = `...`

###### email

`string` = `...`

###### linkExpiration?

`Date` = `...`

###### logoUrl?

`string` = `...`

###### maxRetryAttempts?

`number` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### mobileNumber?

`string` = `...`

###### pageTitle?

`string` = `...`

###### paymentOptions?

`string` = `...`

###### paymentPlan?

`number` = `...`

###### reference

`string` = `...`

###### sessionDuration?

`number` = `...`

###### subaccounts?

`object`[] = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Promise<VoltaxPaymentResponse>

#### Example

```ts
const flutterwave = Voltax('flutterwave', { secretKey: '...' });
const response = await flutterwave.initiatePayment({
  amount: 100,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: 'unique-ref',
  callbackUrl: 'https://example.com/callback',
  // Flutterwave-specific options (flat, not nested)
  customerName: 'John Doe',
  pageTitle: 'My Store',
  logoUrl: 'https://example.com/logo.png',
});
```

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initiatePayment`](/reference/interfaces/voltaxprovider/#initiatepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:122](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L122)

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
