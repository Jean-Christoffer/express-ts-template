import { z } from "zod";

export const userSchema = z.object({
  email: z.email("Please enter a valid email address").transform((v) => v.trim().toLowerCase()),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters")
    .transform((v) => v.trim()),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userSignInSchema = z.object({
  email: z.email("Please enter a valid email address").transform((v) => v.trim().toLowerCase()),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});
