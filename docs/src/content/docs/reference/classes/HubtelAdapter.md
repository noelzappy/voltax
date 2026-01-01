---
editUrl: false
next: false
prev: false
title: "HubtelAdapter"
---

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:20](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/hubtel/hubtel.adapter.ts#L20)

Interface that all Voltax Gateways must implement.

## Implements

- [`VoltaxProvider`](/reference/interfaces/voltaxprovider/)

## Constructors

### Constructor

> **new HubtelAdapter**(`config`): `HubtelAdapter`

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:24](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/hubtel/hubtel.adapter.ts#L24)

#### Parameters

##### config

`HubtelConfig`

#### Returns

`HubtelAdapter`

## Methods

### getPaymentStatus()

> **getPaymentStatus**(`reference`): `Promise`\<[`PaymentStatus`](/reference/enumerations/paymentstatus/)\>

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:122](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/hubtel/hubtel.adapter.ts#L122)

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

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:41](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/hubtel/hubtel.adapter.ts#L41)

Initialize payment with Hubtel's checkout API

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

Defined in: [packages/node/src/providers/hubtel/hubtel.adapter.ts:93](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/providers/hubtel/hubtel.adapter.ts#L93)

Get transaction details.

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<[`VoltaxPaymentResponse`](/reference/interfaces/voltaxpaymentresponse/)\>

#### Implementation of

[`VoltaxProvider`](/reference/interfaces/voltaxprovider/).[`verifyTransaction`](/reference/interfaces/voltaxprovider/#verifytransaction)
