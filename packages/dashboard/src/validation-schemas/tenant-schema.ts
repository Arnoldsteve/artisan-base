import { z } from "zod";
import { Currency } from "@/types/currency"; 

export const createTenantSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(80, "Store name must be less than 80 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Only letters, numbers and hyphens allowed."),
});

// TOP 1% ARCHITECTURE: Specific schema for updates to maintain SOLID principles
export const updateTenantSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(100)
    .trim(),
  currency: z.nativeEnum(Currency, {
    errorMap: () => ({ message: "Please select a valid currency" }),
  }),
  timezone: z.string().min(1, "Timezone is required"),
});

export type CreateTenantFormData = z.infer<typeof createTenantSchema>;
export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;