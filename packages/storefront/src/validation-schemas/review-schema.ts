import { z } from "zod";

export const reviewSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .min(5, "Review must be at least 10 characters long")
    .max(1000, "Review cannot exceed 1000 characters"),
  customerId: z.string().optional(),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
