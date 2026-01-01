/**
 * Base error class for all Voltax errors.
 */
export class VoltaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VoltaxError";
  }
}

/**
 * Thrown when input validation fails (e.g. invalid email, unsupported currency).
 */
export class VoltaxValidationError extends VoltaxError {
  public readonly errors?: any[];

  constructor(message: string, errors?: any[]) {
    super(message);
    this.name = "VoltaxValidationError";
    this.errors = errors;
  }
}

/**
 * Thrown when the gateway returns an error response (e.g. 400 Bad Request from Paystack).
 */
export class VoltaxGatewayError extends VoltaxError {
  public readonly provider: string;
  public readonly statusCode?: number;
  public readonly data?: any;

  constructor(
    message: string,
    provider: string,
    statusCode?: number,
    data?: any
  ) {
    super(message);
    this.name = "VoltaxGatewayError";
    this.provider = provider;
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Thrown when the network request fails (e.g. timeout, DNS error).
 */
export class VoltaxNetworkError extends VoltaxError {
  public readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = "VoltaxNetworkError";
    this.originalError = originalError;
  }
}
