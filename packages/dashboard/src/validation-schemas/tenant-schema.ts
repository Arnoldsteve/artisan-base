import { z } from "zod";

export const createTenantSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .max(80, "Store name must be less than 80 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Only letters, numbers and hyphens allowed."),
});

export type CreateTenantFormData = z.infer<typeof createTenantSchema>;
