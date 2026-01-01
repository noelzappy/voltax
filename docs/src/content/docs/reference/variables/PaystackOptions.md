---
editUrl: false
next: false
prev: false
title: "PaystackOptions"
---

> `const` **PaystackOptions**: `ZodObject`\<\{ `bearer`: `ZodOptional`\<`ZodEnum`\<\[`"subaccount"`, `"account"`\]\>\>; `channels`: `ZodOptional`\<`ZodArray`\<`ZodNativeEnum`\<*typeof* [`PaystackChannel`](/reference/enumerations/paystackchannel/)\>, `"many"`\>\>; `invoiceLimit`: `ZodOptional`\<`ZodNumber`\>; `plan`: `ZodOptional`\<`ZodString`\>; `splitCode`: `ZodOptional`\<`ZodString`\>; `subaccount`: `ZodOptional`\<`ZodString`\>; `transactionCharge`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}, \{ `bearer?`: `"subaccount"` \| `"account"`; `channels?`: [`PaystackChannel`](/reference/enumerations/paystackchannel/)[]; `invoiceLimit?`: `number`; `plan?`: `string`; `splitCode?`: `string`; `subaccount?`: `string`; `transactionCharge?`: `number`; \}\>

Defined in: [packages/node/src/core/schemas.ts:12](https://github.com/noelzappy/voltax/blob/902bc693f22624d3bec9406a5c1d8f6b182d63c0/packages/node/src/core/schemas.ts#L12)
