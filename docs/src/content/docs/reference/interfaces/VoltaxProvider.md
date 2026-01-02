---
editUrl: false
next: false
prev: false
title: "VoltaxProvider"
---

Defined in: [packages/node/src/core/interfaces.ts:18](https://github.com/noelzappy/voltax/blob/72283b5b756ae639e91ddd96e03cb7df05aa0ba9/packages/node/src/core/interfaces.ts#L18)

Interface that all Voltax Gateways must implement.

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/core/interfaces.ts:43](https://github.com/noelzappy/voltax/blob/72283b5b756ae639e91ddd96e03cb7df05aa0ba9/packages/node/src/core/interfaces.ts#L43)

Gets the status of a payment.
In many cases aliases to verifyTransaction, but explicit for clarity.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

***

### initializePayment()

> **initializePayment**(`payload`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/core/interfaces.ts:28](https://github.com/noelzappy/voltax/blob/72283b5b756ae639e91ddd96e03cb7df05aa0ba9/packages/node/src/core/interfaces.ts#L28)

Initiates a payment transaction.

#### Parameters

##### payload

The payment details

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

###### options?

\{ `flutterwave?`: \{ `customerName?`: `string`; `linkExpiration?`: `Date`; `logoUrl?`: `string`; `maxRetryAttempts?`: `number`; `pageTitle?`: `string`; `paymentOptions?`: `string`; `paymentPlan?`: `number`; `sessionDuration?`: `number`; `subaccounts?`: `object`[]; \}; `hubtel?`: \{ `cancellationUrl?`: `string`; `returnUrl?`: `string`; \}; `paystack?`: \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}; \} \| `null` = `...`

###### reference?

`string` = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/core/interfaces.ts:36](https://github.com/noelzappy/voltax/blob/72283b5b756ae639e91ddd96e03cb7df05aa0ba9/packages/node/src/core/interfaces.ts#L36)

Verifies a transaction by its reference.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>
