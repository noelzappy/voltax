import { z } from 'zod';
import { BasePaymentSchema } from '../schemas.js';

/**
 * Flutterwave-specific payment options
 */
export const FlutterwaveOptionsSchema = z.object({
  customerName: z.string().optional(),
  pageTitle: z.string().optional(),
  logoUrl: z.string().url('Logo URL must be a valid URL').optional(),
  sessionDuration: z.number().min(1).max(1440).optional(),
  maxRetryAttempts: z.number().min(1).max(10).optional(),
  paymentPlan: z.number().optional(),
  paymentOptions: z.string().optional(),
  linkExpiration: z.date().optional(),
  mobileNumber: z.string().optional(),
  subaccounts: z
    .array(
      z.object({
        id: z.string().uuid('Subaccount ID must be a valid UUID'),
      }),
    )
    .optional(),
});

/**
 * Complete Flutterwave payment schema (base + Flutterwave-specific options)
 * Note: reference is required for Flutterwave
 */
export const FlutterwavePaymentSchema = BasePaymentSchema.extend({
  reference: z.string().min(1, 'Reference is required for Flutterwave'),
}).extend(FlutterwaveOptionsSchema.shape);

export type FlutterwavePaymentDTO = z.infer<typeof FlutterwavePaymentSchema>;
export type FlutterwaveOptions = z.infer<typeof FlutterwaveOptionsSchema>;
