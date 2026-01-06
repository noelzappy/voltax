---
editUrl: false
next: false
prev: false
title: "FlutterwavePaymentSchema"
---

> `const` **FlutterwavePaymentSchema**: `ZodObject`\<`object` & `object` & `object`, `"strip"`, `ZodTypeAny`, \{ `amount`: `number`; `callbackUrl?`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `customerName?`: `string`; `description?`: `string`; `email`: `string`; `linkExpiration?`: `Date`; `logoUrl?`: `string`; `maxRetryAttempts?`: `number`; `metadata?`: `Record`\<`string`, `any`\>; `mobileNumber?`: `string`; `pageTitle?`: `string`; `paymentOptions?`: `string`; `paymentPlan?`: `number`; `reference`: `string`; `sessionDuration?`: `number`; `subaccounts?`: `object`[]; \}, \{ `amount`: `number`; `callbackUrl?`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `customerName?`: `string`; `description?`: `string`; `email`: `string`; `linkExpiration?`: `Date`; `logoUrl?`: `string`; `maxRetryAttempts?`: `number`; `metadata?`: `Record`\<`string`, `any`\>; `mobileNumber?`: `string`; `pageTitle?`: `string`; `paymentOptions?`: `string`; `paymentPlan?`: `number`; `reference`: `string`; `sessionDuration?`: `number`; `subaccounts?`: `object`[]; \}\>

Defined in: [packages/node/src/core/provider-schemas/flutterwave.schema.ts:30](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/provider-schemas/flutterwave.schema.ts#L30)

Complete Flutterwave payment schema (base + Flutterwave-specific options)
Note: reference is required for Flutterwave
