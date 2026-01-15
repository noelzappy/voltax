import axios, { AxiosInstance } from 'axios';
import { VoltaxPaymentResponse, VoltaxProvider } from '../../core/interfaces.js';
import {
  LibertePayCheckout,
  LibertePayConfig,
  LibertePayResponse,
  LibertePayTransaction,
} from './types.js';
import {
  LibertePayPaymentDTO,
  LibertePayPaymentSchema,
} from '../../core/provider-schemas/libertepay.schema.js';
import { handleGatewayError, VoltaxValidationError } from '../../core/errors.js';
import { PaymentStatus } from '../../core/enums.js';

export class LibertePayAdapter implements VoltaxProvider<LibertePayPaymentDTO> {
  private readonly axiosClient: AxiosInstance;

  constructor({ secretKey, testEnv }: LibertePayConfig) {
    if (!secretKey) {
      throw new VoltaxValidationError('LibertePay secret key is required');
    }
    this.axiosClient = axios.create({
      baseURL: testEnv
        ? 'https://uat-360pay-merchant-api.libertepay.com/v1'
        : 'https://360pay-merchant-api.libertepay.com/v1',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });
  }

  async initiatePayment(payload: LibertePayPaymentDTO): Promise<VoltaxPaymentResponse> {
    const validation = LibertePayPaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError('Validation Failed', validation.error.errors);
    }

    const { amount, email, mobileNumber, paymentSlug, reference } = payload;
    const apiPayload = {
      amount,
      emailid: email,
      reference,
      phone_number: mobileNumber,
      payment_slug: paymentSlug,
    };
    try {
      const { data } = await this.axiosClient.post<LibertePayResponse<LibertePayCheckout>>(
        '/transactions/initiate',
        apiPayload,
      );

      return {
        status: PaymentStatus.PENDING, // Initialization is always pending until user pays
        reference,
        externalReference: data.data.reference,
        authorizationUrl: data.data.payment_url,
        raw: data,
      };
    } catch (error) {
      handleGatewayError(error, 'LibertePay');
    }
  }

  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    if (!reference) {
      throw new VoltaxValidationError('Transaction reference is required for verification');
    }

    try {
      const { data } = await this.axiosClient.post<LibertePayResponse<LibertePayTransaction>>(
        `/payments/status-check`,
        {
          transaction_id: reference,
        },
      );

      return {
        status: this.mapStatus(data.data.status_code),
        reference,
        externalReference: data.data.transaction_id,
        raw: data,
      };
    } catch (error) {
      handleGatewayError(error, 'LibertePay');
    }
  }

  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    const response = await this.verifyTransaction(reference);
    return response.status;
  }

  private mapStatus(status: string): PaymentStatus {
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
