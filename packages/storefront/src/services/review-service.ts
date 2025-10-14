
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { Review, ProductReviewsResponse } from "@/types/review";

export class ReviewService {
  async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
    if (!productId) {
      return {
        productId: "",
        slug: "",
        averageRating: 0,
        reviewCount: 0,
        reviews: [],
      };
    }

    try {
      const response = await apiClient.get<ApiResponse<ProductReviewsResponse>>(
        `/api/v1/storefront/reviews/product/${productId}`
      );

      console.log("product review response from service", response.data);
      
      return (
        response.data || {
          productId: productId,
          slug: "",
          averageRating: 0,
          reviewCount: 0,
          reviews: [],
        }
      );
    } catch (error) {
      console.error("Failed to fetch product reviews", error);
      return {
        productId: productId,
        slug: "",
        averageRating: 0,
        reviewCount: 0,
        reviews: [],
      };
    }
  }

  async createReview(review: any) {
    console.log("srevice received clined request like this", review)
    const response = await apiClient.post<ApiResponse<Review>>(
      `/api/v1/storefront/reviews`,
      review
    );

    console.log("service received api response like this", response)
    return response.data;
  }
}

export const reviewService = new ReviewService();