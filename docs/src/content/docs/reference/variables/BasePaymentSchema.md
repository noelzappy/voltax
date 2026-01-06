---
editUrl: false
next: false
prev: false
title: "BasePaymentSchema"
---

> `const` **BasePaymentSchema**: `ZodObject`\<\{ `amount`: `ZodNumber`; `callbackUrl`: `ZodOptional`\<`ZodString`\>; `currency`: `ZodNativeEnum`\<*typeof* [`Currency`](/reference/enumerations/currency/)\>; `description`: `ZodOptional`\<`ZodString`\>; `email`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `reference`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `amount`: `number`; `callbackUrl?`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `reference?`: `string`; \}, \{ `amount`: `number`; `callbackUrl?`: `string`; `currency`: [`Currency`](/reference/enumerations/currency/); `description?`: `string`; `email`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `reference?`: `string`; \}\>

Defined in: [packages/node/src/core/schemas.ts:8](https://github.com/noelzappy/voltax/blob/b54006be6ebffb706e44a549e28612b44d0d9b6f/packages/node/src/core/schemas.ts#L8)

Base schema for initiating a payment across all Voltax providers.
This provides consistency across providers while allowing each to extend with their own options.
