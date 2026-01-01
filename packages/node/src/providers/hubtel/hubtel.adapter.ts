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
import axios, { AxiosError, } from "axios";
import { HubtelAPIResponse, HubtelConfig, HubtelInitiatePaymentResponse, HubtelPaymentStatus } from "./types.js";
import { InitiatePaymentDTO } from "../../core/schemas.js";
import { validateHubtelRequest } from "./utils.js";


export class HubtelAdapter implements VoltaxProvider {
  private authHeader: string;
    private merchantAccount: string;

  constructor(private readonly config: HubtelConfig) {
    const { clientId, clientSecret, merchantAccountNumber } = this.config;

    if(!clientId || !clientSecret || !merchantAccountNumber) {
      throw new Error("Client ID, Client Secret, and merchant number are required");
    }
    this.authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
    this.merchantAccount = merchantAccountNumber;

  }


  /**
   * Initialize payment with Hubtel's checkout API
   * @param payload @type {InitiatePaymentDTO}
   * @returns Promise<VoltaxPaymentResponse>
   */
  async initializePayment(payload: InitiatePaymentDTO): Promise<VoltaxPaymentResponse> {

    const validation =  validateHubtelRequest(payload) // Safe to use the validation result as the validator will throw an error if validation fails

    const { amount, email,  reference, callbackUrl, metadata, options, description } =
      validation.data;
    const { returnUrl, cancellationUrl } = options?.hubtel || {};

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
        payeeMobileNumber: payload.mobileNumber,
      };

      try {
        const { data } = await axios.post<HubtelAPIResponse<HubtelInitiatePaymentResponse>>(
          'https://payproxyapi.hubtel.com/items/initiate',
          hubtelBody,
          {
            headers: { Authorization: this.authHeader }
          }
        );

        if(data.status !== 'success') {
          throw new Error('Hubtel Initialization Failed');
        }

        const $data = data.data;
        return {
          reference: $data.clientReference,
          authorizationUrl: $data.checkoutUrl,
          status: PaymentStatus.PENDING,
          externalReference: $data.checkoutId,
          raw: data
        };
      } catch (error) {
        this.handleError(error);
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
        const { data } = await axios.get<HubtelAPIResponse<HubtelPaymentStatus>>(
          `https://api-txnstatus.hubtel.com/transactions/${this.merchantAccount}/status`,
          {
            headers: { Authorization: this.authHeader }
          }
        );

        const $data = data.data;

        return {
          reference: $data.clientReference,
          status: this.mapHubtelStatus($data.status),
          externalReference: $data.transactionId,
          raw: data
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
      return response.status;
    }

    /**
     * Maps Hubtel statuses to Voltax Enums.
     */
    private mapHubtelStatus(status: string): PaymentStatus {
      switch (status) {
        case "Paid":
          return PaymentStatus.SUCCESS;
        case "Refunded":
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
            `Hubtel Error: ${data?.message || axiosError.message}`,
            "hubtel",
            axiosError.response.status,
            data
          );
        } else if (axiosError.request) {

          throw new VoltaxNetworkError(
            "No response from payment gateway",
            axiosError
          );
        } else {
          throw new VoltaxError(axiosError.message);
        }
      }
      throw new VoltaxError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }

}
