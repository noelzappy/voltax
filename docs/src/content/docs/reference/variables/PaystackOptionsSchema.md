---
editUrl: false
next: false
prev: false
title: "PaystackOptionsSchema"
---

> `const` **PaystackOptionsSchema**: `ZodObject`\<\{ `bearer`: `ZodOptional`\<`ZodEnum`\<\[`"subaccount"`, `"account"`\]\>\>; `channels`: `ZodOptional`\<`ZodArray`\<`ZodNativeEnum`\<*typeof* [`PaystackChannel`](/reference/enumerations/paystackchannel/)\>, `"many"`\>\>; `invoiceLimit`: `ZodOptional`\<`ZodNumber`\>; `plan`: `ZodOptional`\<`ZodString`\>; `splitCode`: `ZodOptional`\<`ZodString`\>; `subaccount`: `ZodOptional`\<`ZodString`\>; `transactionCharge`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}, \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}\>

Defined in: [packages/node/src/core/provider-schemas/paystack.schema.ts:8](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/provider-schemas/paystack.schema.ts#L8)

Paystack-specific payment options
