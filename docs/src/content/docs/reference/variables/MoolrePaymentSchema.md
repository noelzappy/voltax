---
editUrl: false
next: false
prev: false
title: "MoolrePaymentSchema"
---

> `const` **MoolrePaymentSchema**: `ZodObject`\<`object` & `object` & `object`, `"strip"`, `ZodTypeAny`, \{ `accountNumberOverride?`: `string`; `amount`: `number`; `callbackUrl`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `linkReusable?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `redirectUrl`: `string`; `reference`: `string`; \}, \{ `accountNumberOverride?`: `string`; `amount`: `number`; `callbackUrl`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `linkReusable?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `redirectUrl`: `string`; `reference`: `string`; \}\>

Defined in: [packages/node/src/core/provider-schemas/moolre.schema.ts:17](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/provider-schemas/moolre.schema.ts#L17)

Complete Moolre payment schema (base + Moolre-specific options)
Note: reference and callbackUrl are required for Moolre
