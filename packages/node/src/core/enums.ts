/**
 * Standardized payment status for all Voltax transactions.
 */
export enum PaymentStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

/**
 * Supported currencies for Voltax.
 */
export enum Currency {
  GHS = "GHS",
  NGN = "NGN",
  USD = "USD",
  KES = "KES",
  ZAR = "ZAR",
}


export enum PaystackChannel {
  CARD = "card",
  BANK = "bank",
  APPLE_PAY = "apple_pay",
  USSD = "ussd",
  QR = "qr",
  MOBILE_MONEY = "mobile_money",
  BANK_TRANSFER = "bank_transfer",
  EFT = "eft",
  PAYATTITUDE = "payattitude",
}
