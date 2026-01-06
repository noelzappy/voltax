import { z } from 'zod';
import { BasePaymentSchema } from '../schemas.js';

/**
 * Hubtel-specific payment options
 */
export const HubtelOptionsSchema = z.object({
  returnUrl: z.string().url('Return URL must be a valid URL'),
  cancellationUrl: z.string().url('Cancellation URL must be a valid URL').optional(),
  mobileNumber: z.string().min(10).max(15).optional(),
});

/**
 * Complete Hubtel payment schema (base + Hubtel-specific options)
 * Note: reference and callbackUrl are required for Hubtel
 */
export const HubtelPaymentSchema = BasePaymentSchema.extend({
  reference: z.string().min(1, 'Reference is required for Hubtel'),
  callbackUrl: z.string().url('Callback URL must be a valid URL'),
}).extend(HubtelOptionsSchema.shape);

export type HubtelPaymentDTO = z.infer<typeof HubtelPaymentSchema>;
export type HubtelOptions = z.infer<typeof HubtelOptionsSchema>;
