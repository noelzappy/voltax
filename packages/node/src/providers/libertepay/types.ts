export interface LibertePayConfig {
  secretKey: string;
  testEnv: boolean;
}

export interface LibertePayResponse<T> {
  Code: string;
  status: string;
  msg: string;
  data: T;
}

export interface LibertePayCheckout {
  access_code: string;
  payment_url: string;
  reference: string;
}

export interface LibertePayTransaction {
  account_name: string;
  account_number: string;
  amount: string;
  date_created: string;
  external_transaction_id: 'string';
  isReversed: boolean;
  message: string;
  status_code: string;
  transaction_id: string;
}
