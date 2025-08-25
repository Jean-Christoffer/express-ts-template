import { z } from "zod";

export const CategoryEnum = z.enum(["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"]);

export const FrequencyEnum = z.enum(["daily", "weekly", "monthly", "yearly"]);
export const StatusEnum = z.enum(["active", "cancelled", "expired"]);

const ymdDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format");

const Currency = z
  .string()
  .trim()
  .length(3, "Use a 3-letter ISO currency code (e.g., NOK)")
  .transform((s) => s.toUpperCase());

export const subscriptionSchema = z.object({
  category: CategoryEnum.default("other"),
  currency: Currency.default("NOK"),
  frequency: FrequencyEnum.default("monthly"),
  name: z.string().min(1, "Name is required").max(255),
  payment: z.string().min(1, "Payment is required"),
  price: z.coerce.number().int().nonnegative(),
  renewalDate: ymdDate.optional().nullable().default(null),
  startDate: ymdDate,
  status: StatusEnum.default("active"),
});
