import { z } from "zod";

/**
 * Zod schemas for validating Auth-related request payloads.
 * (Placeholder for future endpoints like register, reset-password etc.)
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
