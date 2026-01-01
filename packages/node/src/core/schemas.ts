import { z } from 'zod';
import { Currency, PaystackChannel } from './enums.js';

export const HubtelOptions = z.object({
  returnUrl: z.string().url('Return URL must be a valid URL').optional(),
  cancellationUrl: z
    .string()
    .url('Callback URL must be a valid URL')
    .optional(),
});

export const PaystackOptions = z.object({
  channels: z.array(z.nativeEnum(PaystackChannel)).optional(),
  subaccount: z.string().optional(),
  splitCode: z.string().optional(),
  bearer: z.enum(['subaccount', 'account']).optional(),
  transactionCharge: z.number().min(0).optional(),
  plan: z.string().optional(),
  invoiceLimit: z.number().min(1).optional(),
});

export const FlutterwaveOptions = z.object({
  customerName: z.string().optional(),
  pageTitle: z.string().optional(),
  logoUrl: z.string().url('Logo URL must be a valid URL').optional(),
  sessionDuration: z.number().min(1).max(1440).optional(),
  maxRetryAttempts: z.number().min(1).max(10).optional(),
  paymentPlan: z.number().optional(),
  paymentOptions: z.string().optional(),
  linkExpiration: z.date().optional(),
  subaccounts: z
    .array(
      z.object({
        id: z.string().uuid('Subaccount ID must be a valid UUID'),
      }),
    )
    .optional(),
});

/**
 * Generic schema for initiating a payment across Voltax.
 */
export const InitiatePaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  email: z.string().email('Invalid email address'),
  currency: z.nativeEnum(Currency, {
    errorMap: () => ({
      message:
        'Invalid or missing currency. Use Currency.GHS, Currency.NGN, etc.',
    }),
  }),
  mobileNumber: z.string().min(10).max(15).optional(),
  description: z.string().max(255).optional(),
  callbackUrl: z.string().url('Callback URL must be a valid URL').optional(),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),

  options: z
    .object({
      paystack: PaystackOptions.strict().optional(),
      hubtel: HubtelOptions.strict().optional(),
      flutterwave: FlutterwaveOptions.strict().optional(),
    })
    .optional()
    .nullable(),
});

export type InitiatePaymentDTO = z.infer<typeof InitiatePaymentSchema>;
