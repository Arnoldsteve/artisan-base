import { apiClient } from "@/lib/client-api";
import { PaginatedResponse } from "@/types";
import { 
  Review, 
  CreateReviewDto, 
  ReviewSummary 
} from "@/types/reviews";

/**
 * SOLID Principle: Single Responsibility
 * This service handles all network requests related to Product Reviews.
 * Multi-tenancy is handled automatically by the apiClient headers.
 */
export class ReviewService {
  /**
   * PUBLIC: Submit a new review from the storefront.
   */
  async create(data: CreateReviewDto): Promise<Review> {
    return apiClient.post<Review>("/reviews", data);
  }

  /**
   * PUBLIC: Fetch reviews for a specific product.
   */
  async getByProduct(productId: string): Promise<Review[]> {
    return apiClient.get<Review[]>(`/reviews/product/${productId}`);
  }

  /**
   * PUBLIC: Get the star-rating summary (Average & Count).
   */
  async getSummary(productId: string): Promise<ReviewSummary> {
    return apiClient.get<ReviewSummary>(`/reviews/product/${productId}/summary`);
  }

  /**
   * PRIVATE (Dashboard): Remove a review.
   * Millions of Users: Restricted to store owners/admins via backend guards.
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/reviews/${id}`);
  }

  /**
   * PRIVATE (Dashboard): Fetch all reviews for the current tenant.
   * Note: This will be used by the global Reviews management page.
   */
 async getAll(page: number, limit: number, search: string): Promise<PaginatedResponse<Review>> {
  return apiClient.get<PaginatedResponse<Review>>("/reviews", {
    params: { page, limit, search }
  });
}
}

export const reviewService = new ReviewService();