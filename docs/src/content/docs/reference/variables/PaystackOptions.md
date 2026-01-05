---
editUrl: false
next: false
prev: false
title: "PaystackOptions"
---

> `const` **PaystackOptions**: `ZodObject`\<\{ `bearer`: `ZodOptional`\<`ZodEnum`\<\[`"subaccount"`, `"account"`\]\>\>; `channels`: `ZodOptional`\<`ZodArray`\<`ZodNativeEnum`\<*typeof* [`PaystackChannel`](/reference/enumerations/paystackchannel/)\>, `"many"`\>\>; `invoiceLimit`: `ZodOptional`\<`ZodNumber`\>; `plan`: `ZodOptional`\<`ZodString`\>; `splitCode`: `ZodOptional`\<`ZodString`\>; `subaccount`: `ZodOptional`\<`ZodString`\>; `transactionCharge`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}, \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}\>

Defined in: packages/node/src/core/provider-schemas/paystack.schema.ts:4
