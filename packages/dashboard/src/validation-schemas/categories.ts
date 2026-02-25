import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(50, "Must be at most 50 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .refine((val) => /^[a-z0-9-]+$/.test(val.toLowerCase()), {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),

  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Must be at most 500 characters")
    .optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
