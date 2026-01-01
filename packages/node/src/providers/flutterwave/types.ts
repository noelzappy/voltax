export interface FlutterwaveConfig {
  secretKey: string;
}

export interface FlutterwaveResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface FlutterwaveTransaction {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  status: string;
  payment_type: string;
  created_at: string;
  account_id: number;
  card: FlutterwaveCard;
  meta: Record<string, any>;
  amount_settled: number;
  customer: FlutterwaveCustomer;
}

export interface FlutterwaveCard {
  first_6digits: string;
  last_4digits: string;
  issuer: string;
  country: string;
  type: string;
  token: string;
  expiry: string;
}

export interface FlutterwaveCustomer {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  created_at: string;
}
