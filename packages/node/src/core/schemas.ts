import { z } from "zod";
import { Currency } from "./enums.js";
import { PaystackOptions } from "./provider-schemas/paystack.schema.js";
import { HubtelOptions } from "./provider-schemas/hubtel.schema.js";
import { FlutterwaveOptions } from "./provider-schemas/flutterwave.schema.js";
import { MoolreOptions } from "./provider-schemas/moolre.schema.js";

/**
 * Generic schema for initiating a payment across Voltax.
 */
export const InitiatePaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  email: z.string().email("Invalid email address"),
  currency: z.nativeEnum(Currency, {
    errorMap: () => ({
      message:
        "Invalid or missing currency. Use Currency.GHS, Currency.NGN, etc.",
    }),
  }),
  description: z.string().max(255).optional(),
  callbackUrl: z.string().url("Callback URL must be a valid URL").optional(),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),

  options: z
    .object({
      paystack: PaystackOptions.strict().optional(),
      hubtel: HubtelOptions.strict().optional(),
      flutterwave: FlutterwaveOptions.strict().optional(),
      moolre: MoolreOptions.strict().optional(),
    })
    .optional()
    .nullable(),
});

export type InitiatePaymentDTO = z.infer<typeof InitiatePaymentSchema>;
export { PaystackOptions, HubtelOptions, FlutterwaveOptions, MoolreOptions };
