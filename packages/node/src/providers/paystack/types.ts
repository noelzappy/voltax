export interface PaystackConfig {
  secretKey: string;
}


export interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaystackTransaction {
  id: number
  domain: string
  status: string
  reference: string
  receipt_number: any
  amount: number
  message: any
  gateway_response: string
  paid_at: string
  created_at: string
  channel: string
  currency: string
  ip_address: string
  metadata: string
  log: PaystackLog
  fees: number
  fees_split: any
  authorization: PaystackAuthorization
  customer: PaystackCustomer
  plan: any
  split: any
  order_id: any
  paidAt: string
  createdAt: string
  requested_amount: number
  pos_transaction_data: any
  source: any
  fees_breakdown: any
  connect: any
  transaction_date: string
  plan_object: any
  subaccount: any
}

export interface PaystackLog {
  start_time: number
  time_spent: number
  attempts: number
  errors: number
  success: boolean
  mobile: boolean
  input: any[]
  history: PaystackHistory[]
}

export interface PaystackHistory {
  type: string
  message: string
  time: number
}

export interface PaystackAuthorization {
  authorization_code: string
  bin: string
  last4: string
  exp_month: string
  exp_year: string
  channel: string
  card_type: string
  bank: string
  country_code: string
  brand: string
  reusable: boolean
  signature: string
  account_name: any
}

export interface PaystackCustomer {
  id: number
  first_name: any
  last_name: any
  email: string
  customer_code: string
  phone: any
  metadata: any
  risk_action: string
  international_format_phone: any
}
