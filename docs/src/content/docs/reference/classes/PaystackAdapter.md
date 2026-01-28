---
editUrl: false
next: false
prev: false
title: "PaystackAdapter"
---

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:12](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/paystack/paystack.adapter.ts#L12)

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

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)\<[`PaystackPaymentDTO`](/reference/type-aliases/paystackpaymentdto/)\>

## Constructors

### Constructor

> **new PaystackAdapter**(`__namedParameters`): `PaystackAdapter`

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:15](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/paystack/paystack.adapter.ts#L15)

#### Parameters

##### \_\_namedParameters

`PaystackConfig`

#### Returns

`PaystackAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:150](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/paystack/paystack.adapter.ts#L150)

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

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:49](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/paystack/paystack.adapter.ts#L49)

Initialize a payment with Paystack.

#### Parameters

##### payload

Payment details including amount, email, currency, and optional Paystack-specific options

###### amount

`number` = `...`

###### bearer?

`"subaccount"` \| `"account"` = `...`

###### callbackUrl?

`string` = `...`

###### channels?

[`PaystackChannel`](/reference/enumerations/paystackchannel/)[] = `...`

###### currency

[`Currency`](/reference/enumerations/currency/) = `...`

###### description?

`string` = `...`

###### email

`string` = `...`

###### invoiceLimit?

`number` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### plan?

`string` = `...`

###### reference?

`string` = `...`

###### splitCode?

`string` = `...`

###### subaccount?

`string` = `...`

###### transactionCharge?

`number` = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Promise<VoltaxPaymentResponse>

#### Example

```ts
const paystack = Voltax('paystack', { secretKey: '...' });
const response = await paystack.initiatePayment({
  amount: 100,
  email: 'customer@example.com',
  currency: Currency.NGN,
  reference: 'unique-ref',
  // Paystack-specific options (flat, not nested)
  channels: [PaystackChannel.CARD, PaystackChannel.BANK],
  subaccount: 'ACCT_xxx',
});
```

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initiatePayment`](/reference/interfaces/voltaxprovider/#initiatepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:125](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/paystack/paystack.adapter.ts#L125)

Verify a transaction with Paystack.

#### Parameters

##### reference

`string`

The transaction reference to verify.

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

The payment response.

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`verifyTransaction`](/reference/interfaces/voltaxprovider/#verifytransaction)
