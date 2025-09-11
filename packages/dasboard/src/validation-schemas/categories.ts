import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Category name is required").max(100, "Name too long"),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
