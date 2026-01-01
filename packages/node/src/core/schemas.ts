import { z } from "zod";
import { PaystackChannel } from "./enums.js";


export const HubtelOptions = z.object({
  returnUrl: z.string().url("Return URL must be a valid URL").optional(),
  cancellationUrl: z.string().url("Callback URL must be a valid URL").optional(),
});

export const PaystackOptions = z.object({
    channels: z.array(z.nativeEnum(PaystackChannel)).optional(),
    subaccount: z.string().optional(),
    splitCode: z.string().optional(),
    bearer: z.enum(["subaccount", "account"]).optional(),
    transactionCharge: z.number().min(0).optional(),
    plan: z.string().optional(),
    invoiceLimit: z.number().min(1).optional(),
    currency: z.string().optional(),
});

/**
 * Generic schema for initiating a payment across Voltax.
 */
export const InitiatePaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  email: z.string().email("Invalid email address"),

  mobileNumber: z.string().min(10).max(15).optional(),
  description: z.string().max(255).optional(),
  callbackUrl: z.string().url("Callback URL must be a valid URL").optional(),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),

  options: z.object({
    paystack: PaystackOptions.optional(),
    hubtel: HubtelOptions.optional(),
  })
});


export type InitiatePaymentDTO = z.infer<typeof InitiatePaymentSchema>;
