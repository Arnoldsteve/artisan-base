// src/services/review.ts
import { apiClient } from "@/lib/api-client";
import { ReviewSchema } from "@/validation-schemas/review";
import { ApiResponse } from "@/types";

export interface Review {
  id: string;
  productId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export class ReviewService {
  // Fetch all reviews for a product
  async getProductReviews(productId: string): Promise<Review[]> {
    if (!productId) return [];
    const response = await apiClient.get<ApiResponse<Review[]>>(
      `/api/v1/storefront/products/${productId}/reviews`
    );
    return response.data;
  }

  // Fetch a single review by ID
  async getReview(reviewId: string): Promise<Review | null> {
    if (!reviewId) return null;
    const response = await apiClient.get<ApiResponse<Review>>(
      `/api/v1/storefront/reviews/${reviewId}`
    );
    return response.data;
  }

  // Create a new review
  async createReview(review: ReviewSchema): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      `/api/v1/storefront/reviews`,
      review
    );
    return response.data;
  }
}

export const reviewService = new ReviewService();
