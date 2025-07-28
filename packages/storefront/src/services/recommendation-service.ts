// File: packages/storefront/src/services/recommendation-service.ts

import { apiClient } from "@/lib/api-client";
import { Product } from "@/types"; // Assuming you have a Product type defined in your frontend

export class RecommendationService {
  /**
   * Fetches a list of recommended products for a given product ID.
   * @param productId The ID of the product to get recommendations for.
   * @returns A promise that resolves to an array of recommended Product objects.
   */
  async getRecommendations(productId: string): Promise<Product[]> {
    // If there's no productId, return an empty array immediately.
    if (!productId) {
      return [];
    }

    // Construct the correct API endpoint URL.
    const endpoint = `/api/v1/storefront/products/${productId}/recommendations`;

    // Make the API call using your configured client.
    const response = await apiClient.get<Product[]>(endpoint);
    
    return response;
  }
}

// Export a pre-instantiated singleton instance for easy use across the app.
export const recommendationService = new RecommendationService();