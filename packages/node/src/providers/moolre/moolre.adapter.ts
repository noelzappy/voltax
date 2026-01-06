import axios, { AxiosInstance } from 'axios';
import { VoltaxPaymentResponse, VoltaxProvider } from '../../core/interfaces.js';
import {
  MoolreAdapterOptions,
  MoolreAPIResponse,
  MoolrePaymentLinkData,
  MoolreTransaction,
} from './types.js';
import {
  MoolrePaymentSchema,
  MoolrePaymentDTO,
} from '../../core/provider-schemas/moolre.schema.js';
import { handleGatewayError, VoltaxValidationError } from '../../core/errors.js';
import { isValidAmount } from '../../core/utils.js';
import { PaymentStatus } from '../../core/enums.js';

export class MoolreAdapter implements VoltaxProvider<MoolrePaymentDTO> {
  private readonly axiosClient: AxiosInstance;
  private readonly accountNumber: string;

  constructor({ apiPublicKey, apiUser, accountNumber }: MoolreAdapterOptions) {
    this.axiosClient = axios.create({
      baseURL: 'https://api.moolre.com',
      headers: {
        'X-API-USER': apiUser,
        'X-API-PUBKEY': apiPublicKey,
        'Content-Type': 'application/json',
      },
    });
    this.accountNumber = accountNumber;
  }

  /**
   * Initiate a payment with Moolre
   * @param payload - Payment details including amount, email, currency, and Moolre-specific options
   * @returns Promise<VoltaxPaymentResponse>
   *
   * @example
   * ```ts
   * const moolre = Voltax('moolre', { apiUser: '...', accountNumber: '...', apiPublicKey: '...' });
   * const response = await moolre.initiatePayment({
   *   amount: 100,
   *   email: 'customer@example.com',
   *   currency: Currency.GHS,
   *   reference: 'unique-ref',
   *   callbackUrl: 'https://example.com/callback',
   *   // Moolre-specific options (flat, not nested)
   *   redirectUrl: 'https://example.com/redirect',
   *   linkReusable: false,
   * });
   * ```
   */
  async initiatePayment(payload: MoolrePaymentDTO): Promise<VoltaxPaymentResponse> {
    const validation = MoolrePaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError('Validation Failed', validation.error.errors);
    }

    const data = validation.data;

    const validAmount = isValidAmount(data.amount);
    if (!validAmount) {
      throw new VoltaxValidationError('Invalid amount');
    }

    try {
      const response = await this.axiosClient.post<MoolreAPIResponse<MoolrePaymentLinkData>>(
        '/embed/link',
        {
          type: 1,
          amount: data.amount,
          accountNumber: this.accountNumber,
          email: data.email,
          externalref: data.reference,
          callback: data.callbackUrl,
          redirect: data.redirectUrl,
          reusable: data.linkReusable ? '1' : '0',
          currency: data.currency,
          accountnumber: data.accountNumberOverride || this.accountNumber,
          metadata: data.metadata || {},
        },
      );
      const responseData = response.data?.data;
      return {
        status: PaymentStatus.PENDING, // Initialization is always pending until user pays
        reference: responseData.reference,
        authorizationUrl: responseData.authorization_url,
        externalReference: responseData.reference, // Take note it's the same as reference
        raw: response.data,
      };
    } catch (error) {
      handleGatewayError(error, 'Moolre');
    }
  }

  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    if (!reference) throw new VoltaxValidationError('Reference is required for verification');

    try {
      const response = await this.axiosClient.post<MoolreAPIResponse<MoolreTransaction>>(
        '/open/transact/status',
        {
          type: 1,
          idtype: 1,
          id: reference,
          accountnumber: this.accountNumber,
        },
      );
      const responseData = response.data.data;
      return {
        status: this.mapStatus(responseData.txstatus),
        reference: responseData.externalref,
        externalReference: responseData.transactionid,
        raw: response.data,
      };
    } catch (error) {
      handleGatewayError(error, 'Moolre');
    }
  }

  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    const response = await this.verifyTransaction(reference);
    return response.status;
  }

  private mapStatus(status: number): PaymentStatus {
    switch (status) {
      case 1:
        return PaymentStatus.SUCCESS;
      case 2:
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }
}
