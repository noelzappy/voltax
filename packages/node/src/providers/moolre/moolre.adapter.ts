import axios, { AxiosInstance } from "axios";
import {
  VoltaxPaymentResponse,
  VoltaxProvider,
} from "../../core/interfaces.js";
import {
  MoolreAdapterOptions,
  MoolreAPIResponse,
  MoolrePaymentLinkData,
  MoolreTransaction,
} from "./types.js";
import {
  InitiatePaymentDTO,
  InitiatePaymentSchema,
} from "../../core/schemas.js";
import {
  handleGatewayError,
  VoltaxValidationError,
} from "../../core/errors.js";
import { isValidAmount } from "../../core/utils.js";
import { PaymentStatus } from "../../core/enums.js";

export class MoolreAdapter implements VoltaxProvider {
  private readonly axiosClient: AxiosInstance;
  private readonly accountNumber: string;

  constructor({ apiPublicKey, apiUser, accountNumber }: MoolreAdapterOptions) {
    this.axiosClient = axios.create({
      baseURL: "https://api.moolre.com",
      headers: {
        "X-API-USER": apiUser,
        "X-API-PUBKEY": apiPublicKey,
        "Content-Type": "application/json",
      },
    });
    this.accountNumber = accountNumber;
  }

  async initializePayment(
    payload: InitiatePaymentDTO,
  ): Promise<VoltaxPaymentResponse> {
    const validation = InitiatePaymentSchema.safeParse(payload);
    if (!validation.success) {
      throw new VoltaxValidationError(
        "Validation Failed",
        validation.error.errors,
      );
    }

    const validAmount = isValidAmount(validation.data.amount);
    if (!validAmount) {
      throw new VoltaxValidationError("Invalid amount");
    }
    const data = validation.data;

    if (!data.reference) {
      throw new VoltaxValidationError("Reference is required for Moolre");
    }

    if (!data.callbackUrl) {
      throw new VoltaxValidationError("Callback URL is required for Moolre");
    }

    const options = data.options?.moolre || {};
    if (!options.redirectUrl) {
      throw new VoltaxValidationError("Redirect URL is required for Moolre");
    }

    try {
      const response = await this.axiosClient.post<
        MoolreAPIResponse<MoolrePaymentLinkData>
      >("/embed/link", {
        type: 1,
        amount: data.amount,
        accountNumber: this.accountNumber,
        email: data.email,
        externalref: data.reference,
        callback: data.callbackUrl,
        redirect: options.redirectUrl,
        reusable: options.linkReusable ? "1" : "0",
        currency: data.currency,
        accountnumber: options.accountNumberOverride || this.accountNumber,
        metadata: data.metadata || {},
      });
      const responseData = response.data?.data;
      return {
        status: PaymentStatus.PENDING, // Initialization is always pending until user pays
        reference: responseData.reference,
        authorizationUrl: responseData.authorization_url,
        externalReference: responseData.reference, // Take note it's the same as reference
        raw: response.data,
      };
    } catch (error) {
      handleGatewayError(error, "Moolre");
    }
  }

  async verifyTransaction(reference: string): Promise<VoltaxPaymentResponse> {
    if (!reference)
      throw new VoltaxValidationError("Reference is required for verification");

    try {
      const response = await this.axiosClient.post<
        MoolreAPIResponse<MoolreTransaction>
      >("/open/transact/status", {
        type: 1,
        idtype: 1,
        id: reference,
        accountnumber: this.accountNumber,
      });
      const responseData = response.data.data;
      return {
        status: this.mapStatus(responseData.txstatus),
        reference: responseData.externalref,
        externalReference: responseData.transactionid,
        raw: response.data,
      };
    } catch (error) {
      handleGatewayError(error, "Moolre");
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
