import axios, { AxiosInstance } from 'axios';
import {
  handleGatewayError,
  VoltaxValidationError,
} from '../../core/errors.js';
import {
  VoltaxPaymentResponse,
  VoltaxProvider,
} from '../../core/interfaces.js';
import { FlutterwaveConfig, FlutterWaveResponse } from './types.js';
import {
  InitiatePaymentDTO,
  InitiatePaymentSchema,
} from '../../core/schemas.js';
import { PaymentStatus } from '../../core/enums.js';

export class FlutterwaveAdapter implements VoltaxProvider {
  private readonly client: AxiosInstance;

  constructor({ secretKey }: FlutterwaveConfig) {
    if (!secretKey) {
      throw new VoltaxValidationError('Flutterwave secret key is required');
    }
    this.client = axios.create({
      baseURL: 'https://api.flutterwave.com/v3',
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   *  Initiate a payment with Flutterwave
   */
  async initializePayment(
    payload: InitiatePaymentDTO,
  ): Promise<VoltaxPaymentResponse> {
    const validation = InitiatePaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError(validation.error.message);
    }

    const {
      amount,
      email,
      mobileNumber,
      currency,
      callbackUrl,
      metadata,
      description,
      reference,
      options,
    } = validation.data;

    if (!reference) {
      throw new VoltaxValidationError(
        'Payment reference is required for Flutterwave payments',
      );
    }

    const {
      customerName,
      logoUrl,
      pageTitle,
      sessionDuration,
      maxRetryAttempts,
      paymentPlan,
      paymentOptions,
      linkExpiration,
      subaccounts,
    } = options?.flutterwave || {};

    const flutterwavePayload = {
      amount,
      tx_ref: reference,
      currency,
      redirect_url: callbackUrl,
      customer: {
        email,
        phone_number: mobileNumber,
        customer_name: customerName,
      },
      customizations: {
        title: pageTitle || description,
        logo: logoUrl,
      },
      configuration: {
        session_duration: sessionDuration,
      },
      max_retry_attempt: maxRetryAttempts,
      payment_plan: paymentPlan,
      payment_options: paymentOptions,
      link_expiration: linkExpiration,
      subaccounts,
      meta: metadata
        ? Object.values(metadata).map((value, index) => ({
            [`meta_${index}`]: value,
          }))
        : {},
    };

    try {
      const response = await this.client.post<
        FlutterWaveResponse<{
          link: string;
        }>
      >('/payments', payload);

      const data = response.data;

      return {
        status: PaymentStatus.PENDING,
        reference,
        raw: response,
      };
    } catch (error) {
      handleGatewayError(error, 'Flutterwave');
    }
  }

  async;
}
