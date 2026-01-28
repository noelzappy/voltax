---
editUrl: false
next: false
prev: false
title: "VoltaxProvider"
---

Defined in: [packages/node/src/core/interfaces.ts:29](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/interfaces.ts#L29)

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

## Type Parameters

### TPaymentDTO

`TPaymentDTO`

The provider-specific payment payload type

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/core/interfaces.ts:49](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/interfaces.ts#L49)

Gets the status of a payment.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

The payment status

***

### initiatePayment()

> **initiatePayment**(`payload`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/core/interfaces.ts:35](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/interfaces.ts#L35)

Initiates a payment transaction.

#### Parameters

##### payload

`TPaymentDTO`

The provider-specific payment details

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

A standardized payment response

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/core/interfaces.ts:42](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/interfaces.ts#L42)

Verifies a transaction by its reference.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

A standardized payment response with updated status
