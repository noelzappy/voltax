import z from "zod";

export const MoolreOptions = z.object({
  linkReusable: z.boolean().optional(),
  accountNumberOverride: z.string().optional(),
  redirectUrl: z.string().url().optional(),
});
