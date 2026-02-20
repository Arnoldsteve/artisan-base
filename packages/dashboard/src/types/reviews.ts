import { Customer } from "./customers";
import { Product } from "./products";

/**
 * SOLID Principle: Single Source of Truth
 * Matches the Backend Prisma Review model.
 */
export interface Review {
  id: string;
  tenantId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  
  // Optional relations for the admin dashboard view
  product?: Product;
  customer?: Customer;
}

/**
 * Data Transfer Object for creating reviews (Public Storefront)
 */
export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}

/**
 * Response type for aggregated star ratings
 */
export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}