import axios, { AxiosInstance, AxiosError } from "axios";
import {
  VoltaxProvider,
  VoltaxPaymentResponse,
} from "../../core/interfaces.js";
import { PaymentStatus,  } from "../../core/enums.js";
import {
  VoltaxValidationError,
  VoltaxGatewayError,
  VoltaxNetworkError,
  VoltaxError,
} from "../../core/errors.js";
import { InitiatePaymentDTO, InitiatePaymentSchema } from "../../core/schemas.js";
import { isValidAmount } from "../../core/utils.js";


export class PaystackAdapter implements VoltaxProvider {
  private readonly axiosInstance: AxiosInstance;

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new VoltaxValidationError("Paystack secret key is required");
    }

    this.axiosInstance = axios.create({
      baseURL: "https://api.paystack.co",
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Initialize a payment with Paystack.
   * @param payload @type {InitiatePaymentDTO}
   * @returns Promise<VoltaxPaymentResponse>
   */
  async initializePayment(
    payload: InitiatePaymentDTO
  ): Promise<VoltaxPaymentResponse> {

    const validation = InitiatePaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError(
        "Validation Failed",
        validation.error.errors
      );
    }

    const { amount, email,  reference, callbackUrl, metadata, options, description } =
      validation.data;
    const { channels, subaccount, splitCode, bearer, transactionCharge, plan, invoiceLimit, currency } = options?.paystack || {};

    const validAmount = isValidAmount(amount)
    if (!validAmount) {
      throw new VoltaxValidationError("Invalid amount");
    }

    const $metadata = {
      description: description || `Payment for ${reference}`,
      ...metadata
    }

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
      transaction_charge: transactionCharge ,
      plan,
      invoice_limit: invoiceLimit,
      currency,
    };

    try {
      const response = await this.axiosInstance.post(
        "/transaction/initialize",
        paystackPayload
      );
      const data = response.data?.data;

      return {
        status: PaymentStatus.PENDING, // Initialization is always pending until user pays
        reference: data.reference,
        authorizationUrl: data.authorization_url,
        externalReference: data.reference,
        raw: response.data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Verify a transaction with Paystack.
   * @param reference The transaction reference to verify.
   * @returns The payment response.
   */
  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    if (!reference) {
      throw new VoltaxValidationError(
        "Transaction reference is required for verification"
      );
    }

    try {
      const response = await this.axiosInstance.get(
        `/transaction/verify/${reference}`
      );
      const data = response.data?.data;

      return {
        status: this.mapPaystackStatus(data.status),
        reference: data.reference,
        externalReference: data.id?.toString(),
        raw: response.data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Helper to get status directly.
   */
  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    const response = await this.verifyTransaction(reference);
    return response.status
  }

  /**
   * Maps Paystack statuses to Voltax Enums.
   */
  private mapPaystackStatus(status: string): PaymentStatus {
    switch (status) {
      case "success":
        return PaymentStatus.SUCCESS;
      case "failed":
      case "reversed":
      case "abandoned":
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }


  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const data = axiosError.response.data as any;
        throw new VoltaxGatewayError(
          `Paystack Error: ${data?.message || axiosError.message}`,
          "paystack",
          axiosError.response.status,
          data
        );
      } else if (axiosError.request) {

        throw new VoltaxNetworkError(
          "No response from Paystack gateway",
          axiosError
        );
      } else {
        throw new VoltaxError(axiosError.message);
      }
    }
    throw new VoltaxError(
      error instanceof Error ? error.message : "Unknown error occurred with Paystack"
    );
  }
}
