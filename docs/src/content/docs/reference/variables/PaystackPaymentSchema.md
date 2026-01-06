---
editUrl: false
next: false
prev: false
title: "PaystackPaymentSchema"
---

> `const` **PaystackPaymentSchema**: `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `amount`: `number`; `bearer?`: `"subaccount"` \| `"account"`; `callbackUrl?`: `string`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `invoiceLimit?`: `number`; `metadata?`: `Record`\<`string`, `any`\>; `plan?`: `string`; `reference?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}, \{ `amount`: `number`; `bearer?`: `"subaccount"` \| `"account"`; `callbackUrl?`: `string`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `invoiceLimit?`: `number`; `metadata?`: `Record`\<`string`, `any`\>; `plan?`: `string`; `reference?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}\>

Defined in: [packages/node/src/core/provider-schemas/paystack.schema.ts:21](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/provider-schemas/paystack.schema.ts#L21)

Complete Paystack payment schema (base + Paystack-specific options)
