import { PaystackBanks } from '../providers/paystack/types.js';
import { PaymentStatus } from './enums.js';

/**
 * Standardized response from a payment initialization.
 */
export interface VoltaxPaymentResponse {
  status: PaymentStatus;
  reference: string;
  authorizationUrl?: string; // Some providers return a URL to redirect the user to
  externalReference?: string; // Provider's unique ID for the transaction
  raw?: unknown; // The original provider response, for debugging or advanced use cases
}
export interface VoltaxBankResponse {
  status: PaymentStatus;
  data?: PaystackBanks[];
  raw?: unknown; // The original provider response, for debugging or advanced use cases
}

/**
 * Interface that all Voltax payment providers must implement.
 * The generic type TPaymentDTO allows each provider to define its own payment payload type.
 *
 * @template TPaymentDTO - The provider-specific payment payload type
 *
 * @example
 * ```ts
 * class PaystackAdapter implements VoltaxProvider<PaystackPaymentDTO> {
 *   async initiatePayment(payload: PaystackPaymentDTO): Promise<VoltaxPaymentResponse> { ... }
 *   async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> { ... }
 *   async getPaymentStatus(reference: string): Promise<PaymentStatus> { ... }
 * }
 * ```
 */
export interface VoltaxProvider<TPaymentDTO> {
  /**
   * Initiates a payment transaction.
   * @param payload - The provider-specific payment details
   * @returns A standardized payment response
   */
  initiatePayment(payload: TPaymentDTO): Promise<VoltaxPaymentResponse>;

  /**
   * Verifies a transaction by its reference.
   * @param reference - The transaction reference
   * @returns A standardized payment response with updated status
   */
  verifyTransaction(reference: string): Promise<VoltaxPaymentResponse>;

  /**
   * Gets the status of a payment.
   * @param reference - The transaction reference
   * @returns The payment status
   */
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
}
