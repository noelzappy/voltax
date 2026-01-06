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
