import { z } from "zod";
import { countries } from "@/data/countries"; 

// Extract all dial codes like ["+1", "+44", "+254", ...]
const dialCodes = countries.map((c) => c.dialCode);

export const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  countryCode: z.enum([...new Set(dialCodes)] as [string, ...string[]]), // ✅ only allow valid dial codes
  phone: z
    .string()
    .min(5, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional(),
});

// Inference for TypeScript
export type CustomerSchema = z.infer<typeof customerSchema>;
