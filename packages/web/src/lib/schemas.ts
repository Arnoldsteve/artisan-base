// In packages/web/src/lib/schemas.ts
import * as z from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters long."),
  id: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Must be lowercase alphanumeric with dashes."
    ),
});

export const createProductSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  // This is the fix: it allows a valid URL OR an empty string
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});
