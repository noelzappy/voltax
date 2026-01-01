export interface HubtelConfig {
  clientId: string;
  clientSecret: string;
  merchantAccountNumber: string;
}

export interface HubtelInitiatePaymentResponse {
  checkoutUrl: string;
  checkoutId: string;
  clientReference: string;
  checkoutDirectUrl: string;
}

export interface HubtelAPIResponse<T> {
  responseCode: string;
  status?: string;
  message?: string;
  data: T;
}


export interface HubtelTransaction {
  date: string;
  status: "Paid" | "Unpaid" | "Refunded";
  transactionId: string;
  externalTransactionId: string;
  paymentMethod: string;
  clientReference: string;
  currencycode: string;
  amount: number;
  charges: number;
  amountAfterCharges: number;
  isFulfilled: boolean | null
}
