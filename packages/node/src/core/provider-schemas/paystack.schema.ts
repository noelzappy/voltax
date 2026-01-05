import { z } from "zod";
import { PaystackChannel } from "../enums.js";

export const PaystackOptions = z.object({
  channels: z.array(z.nativeEnum(PaystackChannel)).optional(),
  subaccount: z.string().optional(),
  splitCode: z.string().optional(),
  bearer: z.enum(["subaccount", "account"]).optional(),
  transactionCharge: z.number().min(0).optional(),
  plan: z.string().optional(),
  invoiceLimit: z.number().min(1).optional(),
});
