import { z } from 'zod';

export const orderItemSchema = z.object({
  productName: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.union([z.string(), z.number()]),
  image: z.string().url().nullable().optional(),
  sku: z.string().nullable().optional(),
});

export const orderConfirmationSchema = z.object({
  orderNumber: z.string(),
  customerName: z.string().optional(),
  items: z.array(orderItemSchema),
  subtotal: z.union([z.string(), z.number()]),
  taxAmount: z.union([z.string(), z.number()]),
  shippingAmount: z.union([z.string(), z.number()]),
  totalAmount: z.union([z.string(), z.number()]),
  currency: z.string(),
  createdAt: z.string(),
});

export type OrderConfirmationEmailSchema = z.infer<
  typeof orderConfirmationSchema
>;
