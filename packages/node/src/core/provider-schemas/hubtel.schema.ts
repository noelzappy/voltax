import { z } from "zod";

export const HubtelOptions = z.object({
  returnUrl: z.string().url("Return URL must be a valid URL").optional(),
  mobileNumber: z.string().min(10).max(15).optional(),
  cancellationUrl: z
    .string()
    .url("Callback URL must be a valid URL")
    .optional(),
});
