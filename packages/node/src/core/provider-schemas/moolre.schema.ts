import { z } from 'zod';
import { BasePaymentSchema } from '../schemas.js';

/**
 * Moolre-specific payment options
 */
export const MoolreOptionsSchema = z.object({
  redirectUrl: z.string().url('Redirect URL must be a valid URL'),
  linkReusable: z.boolean().optional(),
  accountNumberOverride: z.string().optional(),
});

/**
 * Complete Moolre payment schema (base + Moolre-specific options)
 * Note: reference and callbackUrl are required for Moolre
 */
export const MoolrePaymentSchema = BasePaymentSchema.extend({
  reference: z.string().min(1, 'Reference is required for Moolre'),
  callbackUrl: z.string().url('Callback URL must be a valid URL'),
}).extend(MoolreOptionsSchema.shape);

export type MoolrePaymentDTO = z.infer<typeof MoolrePaymentSchema>;
export type MoolreOptions = z.infer<typeof MoolreOptionsSchema>;
