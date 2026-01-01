import { PaymentStatus } from './enums.js';
import { InitiatePaymentDTO } from './schemas.js';

/**
 * Standardized response from a payment initialization.
 */
export interface VoltaxPaymentResponse {
  status: PaymentStatus;
  reference: string;
  authorizationUrl?: string; // Some providers return a URL to redirect the user to
  externalReference?: string; // Provider's unique ID for the transaction
  raw?: any; // The original provider response, for debugging or advanced use cases
}

/**
 * Interface that all Voltax Gateways must implement.
 */
export interface VoltaxProvider {
  /**
   * Initialize the provider with necessary secrets/config.
   * This is usually done in the constructor, but kept here for clarity if needed.
   */

  /**
   * Initiates a payment transaction.
   * @param payload The payment details
   */
  initializePayment(
    payload: InitiatePaymentDTO,
  ): Promise<VoltaxPaymentResponse>;

  /**
   * Verifies a transaction by its reference.
   * @param reference The transaction reference
   */
  verifyTransaction(reference: string): Promise<VoltaxPaymentResponse>;

  /**
   * Gets the status of a payment.
   * In many cases aliases to verifyTransaction, but explicit for clarity.
   * @param reference The transaction reference
   */
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
}
