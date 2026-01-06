import { z } from 'zod';
import { Currency } from './enums.js';

/**
 * Base schema for initiating a payment across all Voltax providers.
 * This provides consistency across providers while allowing each to extend with their own options.
 */
export const BasePaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  email: z.string().email('Invalid email address'),
  currency: z.nativeEnum(Currency, {
    errorMap: () => ({
      message: 'Invalid or missing currency. Use Currency.GHS, Currency.NGN, etc.',
    }),
  }),
  description: z.string().max(255).optional(),
  callbackUrl: z.string().url('Callback URL must be a valid URL').optional(),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type BasePaymentDTO = z.infer<typeof BasePaymentSchema>;
