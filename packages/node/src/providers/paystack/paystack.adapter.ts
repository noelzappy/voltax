import axios, { AxiosInstance } from 'axios';
import {
  VoltaxBankResponse,
  VoltaxPaymentResponse,
  VoltaxProvider,
} from '../../core/interfaces.js';
import { PaymentStatus } from '../../core/enums.js';
import { VoltaxValidationError, handleGatewayError } from '../../core/errors.js';
import { isValidAmount } from '../../core/utils.js';
import { PaystackBanks, PaystackConfig, PaystackResponse, PaystackTransaction } from './types.js';
import {
  PaystackPaymentSchema,
  PaystackPaymentDTO,
} from '../../core/provider-schemas/paystack.schema.js';

export class PaystackAdapter implements VoltaxProvider<PaystackPaymentDTO> {
  private readonly axiosClient: AxiosInstance;

  constructor({ secretKey }: PaystackConfig) {
    if (!secretKey) {
      throw new VoltaxValidationError('Paystack secret key is required');
    }

    this.axiosClient = axios.create({
      baseURL: 'https://api.paystack.co',
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initialize a payment with Paystack.
   * @param payload - Payment details including amount, email, currency, and optional Paystack-specific options
   * @returns Promise<VoltaxPaymentResponse>
   *
   * @example
   * ```ts
   * const paystack = Voltax('paystack', { secretKey: '...' });
   * const response = await paystack.initiatePayment({
   *   amount: 100,
   *   email: 'customer@example.com',
   *   currency: Currency.NGN,
   *   reference: 'unique-ref',
   *   // Paystack-specific options (flat, not nested)
   *   channels: [PaystackChannel.CARD, PaystackChannel.BANK],
   *   subaccount: 'ACCT_xxx',
   * });
   * ```
   */
  async initiatePayment(payload: PaystackPaymentDTO): Promise<VoltaxPaymentResponse> {
    const validation = PaystackPaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError('Validation Failed', validation.error.errors);
    }

    const {
      amount,
      email,
      reference,
      callbackUrl,
      metadata,
      description,
      currency,
      channels,
      subaccount,
      splitCode,
      bearer,
      transactionCharge,
      plan,
      invoiceLimit,
    } = validation.data;

    const validAmount = isValidAmount(amount);
    if (!validAmount) {
      throw new VoltaxValidationError('Invalid amount');
    }

    const $metadata = {
      description: description || `Payment for ${reference}`,
      ...metadata,
    };

    // Paystack expects amount in kobo (minor units) and currency in standard ISO code.
    const paystackPayload = {
      amount: Math.round(amount * 100).toString(), // Convert to minor units (e.g. 10.50 -> 1050)
      email,
      reference,
      callback_url: callbackUrl,
      metadata: JSON.stringify($metadata),
      channels,
      subaccount,
      split_code: splitCode,
      bearer,
      transaction_charge: transactionCharge,
      plan,
      invoice_limit: invoiceLimit,
      currency,
    };

    try {
      const response = await this.axiosClient.post<
        PaystackResponse<{
          authorization_url: string;
          reference: string;
          access_code: string;
        }>
      >('/transaction/initialize', paystackPayload);
      const data = response.data?.data;
      return {
        status: PaymentStatus.PENDING, // Initialization is always pending until user pays
        reference: data.reference,
        authorizationUrl: data.authorization_url,
        externalReference: data.reference,
        raw: response.data,
      };
    } catch (error) {
      handleGatewayError(error, 'Paystack');
    }
  }

  /**
   * Verify a transaction with Paystack.
   * @param reference The transaction reference to verify.
   * @returns The payment response.
   */
  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    if (!reference) {
      throw new VoltaxValidationError('Transaction reference is required for verification');
    }

    try {
      const response = await this.axiosClient.get<PaystackResponse<PaystackTransaction>>(
        `/transaction/verify/${reference}`,
      );
      const data = response.data?.data;

      return {
        status: this.mapPaystackStatus(data.status),
        reference: data.reference,
        externalReference: data.id?.toString(),
        raw: response.data,
      };
    } catch (error) {
      handleGatewayError(error, 'Paystack');
    }
  }

  /**
   * Verify a transaction with Paystack.
   * @param country The country to fetch banks for.
   * @returns Promise<VoltaxBankResponse>.
   */

  async banks(country: string): Promise<VoltaxBankResponse> {
    try {
      const response = await this.axiosClient.get<PaystackResponse<PaystackBanks[]>>(
        `bank/country=${country}`,
      );
      const data = response.data?.data;
      return {
        status: PaymentStatus.SUCCESS,
        raw: response.data,
        data: data,
      };
    } catch (error) {
      handleGatewayError(error, 'Paystack');
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
   * Maps Paystack statuses to Voltax Enums.
   */
  private mapPaystackStatus(status: string): PaymentStatus {
    switch (status) {
      case 'success':
        return PaymentStatus.SUCCESS;
      case 'failed':
      case 'reversed':
      case 'abandoned':
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }
}
