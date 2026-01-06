import { VoltaxPaymentResponse } from '../../core/interfaces.js';
import { PaymentStatus } from '../../core/enums.js';
import { VoltaxValidationError, handleGatewayError } from '../../core/errors.js';
import axios from 'axios';
import {
  HubtelAPIResponse,
  HubtelConfig,
  HubtelInitiatePaymentResponse,
  HubtelTransaction,
} from './types.js';
import {
  HubtelPaymentSchema,
  HubtelPaymentDTO,
} from '../../core/provider-schemas/hubtel.schema.js';
import { isValidAmount } from '../../core/utils.js';

export class HubtelAdapter {
  private authHeader: string;
  private merchantAccount: string;

  constructor(private readonly config: HubtelConfig) {
    const { clientId, clientSecret, merchantAccountNumber } = this.config;

    if (!clientId || !clientSecret || !merchantAccountNumber) {
      throw new VoltaxValidationError('Client ID, Client Secret, and merchant number are required');
    }
    this.authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
    this.merchantAccount = merchantAccountNumber;
  }

  /**
   * Initialize payment with Hubtel's checkout API
   * @param payload - Payment details including amount, email, currency, and Hubtel-specific options
   * @returns Promise<VoltaxPaymentResponse>
   *
   * @example
   * ```ts
   * const hubtel = Voltax('hubtel', { clientId: '...', clientSecret: '...', merchantAccountNumber: '...' });
   * const response = await hubtel.initiatePayment({
   *   amount: 100,
   *   email: 'customer@example.com',
   *   currency: Currency.GHS,
   *   reference: 'unique-ref',
   *   callbackUrl: 'https://example.com/callback',
   *   // Hubtel-specific options (flat, not nested)
   *   returnUrl: 'https://example.com/return',
   *   mobileNumber: '0241234567',
   * });
   * ```
   */
  async initiatePayment(payload: HubtelPaymentDTO): Promise<VoltaxPaymentResponse> {
    const validation = HubtelPaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError('Validation Failed', validation.error.errors);
    }

    const {
      amount,
      email,
      reference,
      callbackUrl,
      description,
      returnUrl,
      cancellationUrl,
      mobileNumber,
    } = validation.data;

    const validAmount = isValidAmount(amount);
    if (!validAmount) {
      throw new VoltaxValidationError('Invalid amount');
    }

    const $description = description || `Payment for ${reference}`;

    const hubtelBody = {
      totalAmount: amount,
      description: $description,
      callbackUrl: callbackUrl,
      returnUrl: returnUrl,
      merchantAccountNumber: this.merchantAccount,
      cancellationUrl: cancellationUrl || returnUrl,
      clientReference: reference,
      payeeEmail: email,
      payeeMobileNumber: mobileNumber,
    };

    try {
      const { data } = await axios.post<HubtelAPIResponse<HubtelInitiatePaymentResponse>>(
        'https://payproxyapi.hubtel.com/items/initiate',
        hubtelBody,
        {
          headers: { Authorization: this.authHeader },
        },
      );

      if (data.status !== 'success') {
        throw new Error('Hubtel Initialization Failed');
      }

      const $data = data.data;
      return {
        reference: $data.clientReference,
        authorizationUrl: $data.checkoutUrl,
        status: PaymentStatus.PENDING,
        externalReference: $data.checkoutId,
        raw: data,
      };
    } catch (error) {
      handleGatewayError(error, 'Hubtel');
    }
  }

  /**
   * Get transaction details.
   * @param reference
   * @returns
   */
  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    if (!reference) {
      throw new VoltaxValidationError('Reference is required');
    }

    try {
      const { data } = await axios.get<HubtelAPIResponse<HubtelTransaction>>(
        `https://api-txnstatus.hubtel.com/transactions/${this.merchantAccount}/status`,
        {
          headers: { Authorization: this.authHeader },
        },
      );

      const $data = data.data;

      return {
        reference: $data.clientReference,
        status: this.mapHubtelStatus($data.status),
        externalReference: $data.transactionId,
        raw: data,
      };
    } catch (error) {
      handleGatewayError(error, 'Hubtel');
    }
  }

  /**
   * Helper to get status directly.
   */
  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    const response = await this.verifyTransaction(reference);
    return response.status;
  }

  /**
   * Maps Hubtel statuses to Voltax Enums.
   */
  private mapHubtelStatus(status: string): PaymentStatus {
    switch (status) {
      case 'Paid':
        return PaymentStatus.SUCCESS;
      case 'Refunded':
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }
}
