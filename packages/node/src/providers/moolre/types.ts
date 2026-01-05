export interface MoolreAdapterOptions {
  apiUser: string;
  accountNumber: string;
  apiPublicKey: string;
}

export interface MoolreAPIResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface MoolrePaymentLinkData {
  authorization_url: string;
  reference: string;
}

export interface MoolreTransaction {
  txstatus: number;
  txtype: number;
  accountnumber: string;
  payer: string;
  payee: string;
  amount: string;
  value: string;
  transactionid: string;
  externalref: string;
  thirdpartyref: string;
  ts: string;
}
