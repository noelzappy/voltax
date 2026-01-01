---
editUrl: false
next: false
prev: false
title: "PaystackAdapter"
---

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:22](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/paystack/paystack.adapter.ts#L22)

Interface that all Voltax Gateways must implement.

## Implements

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)

## Constructors

### Constructor

> **new PaystackAdapter**(`__namedParameters`): `PaystackAdapter`

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:25](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/paystack/paystack.adapter.ts#L25)

#### Parameters

##### \_\_namedParameters

`PaystackConfig`

#### Returns

`PaystackAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:156](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/paystack/paystack.adapter.ts#L156)

Helper to get status directly.

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`getPaymentStatus`](/reference/interfaces/voltaxprovider/#getpaymentstatus)

***

### initializePayment()

> **initializePayment**(`payload`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:45](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/paystack/paystack.adapter.ts#L45)

Initialize a payment with Paystack.

#### Parameters

##### payload

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

Promise<VoltaxPaymentResponse>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initializePayment`](/reference/interfaces/voltaxprovider/#initializepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: [packages/node/src/providers/paystack/paystack.adapter.ts:129](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/paystack/paystack.adapter.ts#L129)

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
