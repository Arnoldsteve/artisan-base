import { z } from 'zod';

// Zod schema for validating the product form.
// This defines the fields that are editable by the user.
export const productFormSchema = z.object({
  // Keep the ID for identifying the record, but we'll strip it before sending to the API for updates.
  id: z.string().optional(),
  
  name: z.string().min(1, { message: "Product name is required." }),
  // slug: z.string().min(1, { message: "Slug is required." }),
  
  // Use .coerce to automatically convert string input from the form to a number
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  inventoryQuantity: z.coerce.number().int({ message: "Inventory must be a whole number." }),
  
  sku: z.string().optional(),
  description: z.string().optional(),
  
  // Use z.boolean() for checkboxes or a transformer for select/radio
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// Infer the TypeScript type from the Zod schema for use in our forms.
export type ProductFormData = z.infer<typeof productFormSchema>;