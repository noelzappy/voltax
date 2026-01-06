import { z } from 'zod';
import { PaystackChannel } from '../enums.js';
import { BasePaymentSchema } from '../schemas.js';

/**
 * Paystack-specific payment options
 */
export const PaystackOptionsSchema = z.object({
  channels: z.array(z.nativeEnum(PaystackChannel)).optional(),
  subaccount: z.string().optional(),
  splitCode: z.string().optional(),
  bearer: z.enum(['subaccount', 'account']).optional(),
  transactionCharge: z.number().min(0).optional(),
  plan: z.string().optional(),
  invoiceLimit: z.number().min(1).optional(),
});

/**
 * Complete Paystack payment schema (base + Paystack-specific options)
 */
export const PaystackPaymentSchema = BasePaymentSchema.extend(PaystackOptionsSchema.shape);

export type PaystackPaymentDTO = z.infer<typeof PaystackPaymentSchema>;
export type PaystackOptions = z.infer<typeof PaystackOptionsSchema>;
