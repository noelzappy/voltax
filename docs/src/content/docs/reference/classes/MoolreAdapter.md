---
editUrl: false
next: false
prev: false
title: "MoolreAdapter"
---

Defined in: packages/node/src/providers/moolre/moolre.adapter.ts:23

Interface that all Voltax Gateways must implement.

## Implements

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)

## Constructors

### Constructor

> **new MoolreAdapter**(`__namedParameters`): `MoolreAdapter`

Defined in: packages/node/src/providers/moolre/moolre.adapter.ts:27

#### Parameters

##### \_\_namedParameters

`MoolreAdapterOptions`

#### Returns

`MoolreAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: packages/node/src/providers/moolre/moolre.adapter.ts:123

Gets the status of a payment.
In many cases aliases to verifyTransaction, but explicit for clarity.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`getPaymentStatus`](/reference/interfaces/voltaxprovider/#getpaymentstatus)

***

### initializePayment()

> **initializePayment**(`payload`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: packages/node/src/providers/moolre/moolre.adapter.ts:39

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

###### options?

\{ `flutterwave?`: \{ `customerName?`: `string`; `linkExpiration?`: `Date`; `logoUrl?`: `string`; `maxRetryAttempts?`: `number`; `mobileNumber?`: `string`; `pageTitle?`: `string`; `paymentOptions?`: `string`; `paymentPlan?`: `number`; `sessionDuration?`: `number`; `subaccounts?`: `object`[]; \}; `hubtel?`: \{ `cancellationUrl?`: `string`; `mobileNumber?`: `string`; `returnUrl?`: `string`; \}; `moolre?`: \{ `accountNumberOverride?`: `string`; `linkReusable?`: `boolean`; `redirectUrl?`: `string`; \}; `paystack?`: \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}; \} \| `null` = `...`

###### reference?

`string` = `...`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`initializePayment`](/reference/interfaces/voltaxprovider/#initializepayment)

***

### verifyTransaction()

> **verifyTransaction**(`reference`): `Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

Defined in: packages/node/src/providers/moolre/moolre.adapter.ts:98

Verifies a transaction by its reference.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`verifyTransaction`](/reference/interfaces/voltaxprovider/#verifytransaction)
