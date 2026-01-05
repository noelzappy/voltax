---
editUrl: false
next: false
prev: false
title: "FlutterwaveAdapter"
---

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:21](https://github.com/noelzappy/voltax/blob/626c92119cb8ab7a82c2674b0cefd68f9c98c2f7/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L21)

Interface that all Voltax Gateways must implement.

## Implements

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)

## Constructors

### Constructor

> **new FlutterwaveAdapter**(`__namedParameters`): `FlutterwaveAdapter`

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:24](https://github.com/noelzappy/voltax/blob/626c92119cb8ab7a82c2674b0cefd68f9c98c2f7/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L24)

#### Parameters

##### \_\_namedParameters

`FlutterwaveConfig`

#### Returns

`FlutterwaveAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:150](https://github.com/noelzappy/voltax/blob/626c92119cb8ab7a82c2674b0cefd68f9c98c2f7/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L150)

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

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:41](https://github.com/noelzappy/voltax/blob/626c92119cb8ab7a82c2674b0cefd68f9c98c2f7/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L41)

Initiate a payment with Flutterwave

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

Defined in: [packages/node/src/providers/flutterwave/flutterwave.adapter.ts:126](https://github.com/noelzappy/voltax/blob/626c92119cb8ab7a82c2674b0cefd68f9c98c2f7/packages/node/src/providers/flutterwave/flutterwave.adapter.ts#L126)

Verifies a transaction by its reference.

#### Parameters

##### reference

`string`

The transaction reference

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`verifyTransaction`](/reference/interfaces/voltaxprovider/#verifytransaction)
