import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z.string().optional(),
});

// Inference for TypeScript
export type CustomerSchema = z.infer<typeof customerSchema>;
