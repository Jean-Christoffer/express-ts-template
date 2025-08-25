/* eslint-disable */
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { z } from "zod";

const envSchema = z.object({
  ARCJET_ENV: z.string(),
  ARCJET_KEY: z.string(),
  JWT_EXPIRES_IN: z.preprocess((val) => Number(val), z.number()),
  JWT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

const aj = arcjet({
  characteristics: ["ip.src"],
  key: env.ARCJET_KEY,

  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      allow: ["CATEGORY:SEARCH_ENGINE", "POSTMAN"],
      mode: "LIVE",
    }),
    tokenBucket({
      capacity: 10,
      interval: 10,
      mode: "LIVE",
      refillRate: 5,
    }),
  ],
});

export { env };
export { aj };
