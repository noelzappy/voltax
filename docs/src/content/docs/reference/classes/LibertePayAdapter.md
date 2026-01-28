---
editUrl: false
next: false
prev: false
title: "LibertePayAdapter"
---

Defined in: [packages/node/src/providers/libertepay/libertepay.adapter.ts:16](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/libertepay/libertepay.adapter.ts#L16)

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

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)\<[`LibertePayPaymentDTO`](/reference/type-aliases/libertepaypaymentdto/)\>

## Constructors

### Constructor

> **new LibertePayAdapter**(`__namedParameters`): `LibertePayAdapter`

Defined in: [packages/node/src/providers/libertepay/libertepay.adapter.ts:19](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/libertepay/libertepay.adapter.ts#L19)

#### Parameters

##### \_\_namedParameters

`LibertePayConfig`

#### Returns

`LibertePayAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/libertepay/libertepay.adapter.ts:85](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/libertepay/libertepay.adapter.ts#L85)

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

Defined in: [packages/node/src/providers/libertepay/libertepay.adapter.ts:33](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/libertepay/libertepay.adapter.ts#L33)

Initiates a payment transaction.

#### Parameters

##### payload

The provider-specific payment details

###### amount

`number` = `...`

###### callbackUrl?

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

###### paymentSlug?

`string` = `...`

###### reference?

`string` = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

A standardized payment response

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initiatePayment`](/reference/interfaces/voltaxprovider/#initiatepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/libertepay/libertepay.adapter.ts:64](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/providers/libertepay/libertepay.adapter.ts#L64)

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
