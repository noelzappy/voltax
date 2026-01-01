import { VoltaxValidationError } from "../../core/errors.js";
import {
  InitiatePaymentDTO,
  InitiatePaymentSchema,
} from "../../core/schemas.js";
import { isValidAmount } from "../../core/utils.js";

export const validateHubtelRequest = (payload: InitiatePaymentDTO) => {
  const validation = InitiatePaymentSchema.safeParse(payload);
  if (!validation.success) {
    throw new VoltaxValidationError(
      "Validation Failed",
      validation.error.errors,
    );
  }

  const { amount, reference, callbackUrl, options } = validation.data;

  const { returnUrl } = options?.hubtel || {};

  const validAmount = isValidAmount(amount);
  if (!validAmount) {
    throw new VoltaxValidationError("Invalid amount");
  }

  if (!reference) {
    throw new VoltaxValidationError("Reference is required for Hubtel payment");
  }

  if (!callbackUrl) {
    throw new VoltaxValidationError(
      "Callback URL is required for Hubtel payment",
    );
  }

  if (!returnUrl) {
    throw new VoltaxValidationError(
      "Return URL is required for Hubtel payment",
    );
  }

  return validation;
};
