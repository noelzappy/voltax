---
editUrl: false
next: false
prev: false
title: "FlutterwaveOptionsSchema"
---

> `const` **FlutterwaveOptionsSchema**: `ZodObject`\<\{ `customerName`: `ZodOptional`\<`ZodString`\>; `linkExpiration`: `ZodOptional`\<`ZodDate`\>; `logoUrl`: `ZodOptional`\<`ZodString`\>; `maxRetryAttempts`: `ZodOptional`\<`ZodNumber`\>; `mobileNumber`: `ZodOptional`\<`ZodString`\>; `pageTitle`: `ZodOptional`\<`ZodString`\>; `paymentOptions`: `ZodOptional`\<`ZodString`\>; `paymentPlan`: `ZodOptional`\<`ZodNumber`\>; `sessionDuration`: `ZodOptional`\<`ZodNumber`\>; `subaccounts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `id`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string`; \}, \{ `id`: `string`; \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `customerName?`: `string`; `linkExpiration?`: `Date`; `logoUrl?`: `string`; `maxRetryAttempts?`: `number`; `mobileNumber?`: `string`; `pageTitle?`: `string`; `paymentOptions?`: `string`; `paymentPlan?`: `number`; `sessionDuration?`: `number`; `subaccounts?`: `object`[]; \}, \{ `customerName?`: `string`; `linkExpiration?`: `Date`; `logoUrl?`: `string`; `maxRetryAttempts?`: `number`; `mobileNumber?`: `string`; `pageTitle?`: `string`; `paymentOptions?`: `string`; `paymentPlan?`: `number`; `sessionDuration?`: `number`; `subaccounts?`: `object`[]; \}\>

Defined in: [packages/node/src/core/provider-schemas/flutterwave.schema.ts:7](https://github.com/noelzappy/voltax/blob/0f90834dbd594f24a367fadff44e7df5ad4bd805/packages/node/src/core/provider-schemas/flutterwave.schema.ts#L7)

Flutterwave-specific payment options
