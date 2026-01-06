---
editUrl: false
next: false
prev: false
title: "HubtelPaymentSchema"
---

> `const` **HubtelPaymentSchema**: `ZodObject`\<`object` & `object` & `object`, `"strip"`, `ZodTypeAny`, \{ `amount`: `number`; `callbackUrl`: `string`; `cancellationUrl?`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `mobileNumber?`: `string`; `reference`: `string`; `returnUrl`: `string`; \}, \{ `amount`: `number`; `callbackUrl`: `string`; `cancellationUrl?`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `mobileNumber?`: `string`; `reference`: `string`; `returnUrl`: `string`; \}\>

Defined in: [packages/node/src/core/provider-schemas/hubtel.schema.ts:17](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/provider-schemas/hubtel.schema.ts#L17)

Complete Hubtel payment schema (base + Hubtel-specific options)
Note: reference and callbackUrl are required for Hubtel
