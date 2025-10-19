import { z } from 'zod';


export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Product name is required." }),
  slug: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  inventoryQuantity: z.coerce.number().int({ message: "Inventory must be a whole number." }),
  sku: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
  isFeatured: z.boolean().default(false).optional(),

});

export type ProductFormData = z.infer<typeof productFormSchema>;