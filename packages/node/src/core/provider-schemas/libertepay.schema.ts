import { z } from 'zod';
import { BasePaymentSchema } from '../schemas.js';

export const LibertePayOptionsSchema = z.object({
  mobileNumber: z.string().min(10).max(15).optional(),
  paymentSlug: z.string().optional(),
});

export const LibertePayPaymentSchema = BasePaymentSchema.extend({
  reference: z.string().min(1, 'Reference is required'),
}).extend(LibertePayOptionsSchema.shape);

export type LibertePayPaymentDTO = z.infer<typeof LibertePayPaymentSchema>;
export type LibertePayOptions = z.infer<typeof LibertePayOptionsSchema>;
