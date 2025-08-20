import { z } from "zod";

const envSchema = z.object({
  JWT_EXPIRES_IN: z.preprocess((val) => Number(val), z.number()),
  JWT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export { env };
