import { apiClient } from "@/lib/api-client";
import { 
  Product, 
  ProductFilters 
} from "@/types/product";
import { ApiResponse, CursorPaginatedResponse } from "@/types/shared";

/**
 * SOLID Principle: Single Responsibility
 * This service is purely an orchestrator for fetching product data.
 * All sorting, filtering, and arrival logic is handled by the Backend 
 * via Query Parameters for maximum scale.
 */
export class ProductService {
  /**
   * GLOBAL & TENANT: Fetch products.
   * If TenantProvider has set a tenantId, this returns store-specific products.
   * If not, it returns global marketplace products.
   */
  async getProducts(
    params: ProductFilters & { limit?: number; cursor?: string } = {}
  ): Promise<CursorPaginatedResponse<Product>> {
    return apiClient.get<CursorPaginatedResponse<Product>>(
      "/products", 
      params
    );
  }

  /**
   * PUBLIC: Get a specific product by its URL slug.
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/slug/${slug}`
    );
    return response.data;
  }

  /**
   * PERFORMANCE: Fetch featured products.
   * Backend uses an 'isFeatured' index for sub-millisecond response.
   */
  async getFeaturedProducts(limit = 10): Promise<CursorPaginatedResponse<Product>> {
    return apiClient.get<CursorPaginatedResponse<Product>>(
      "/products/featured",
      { limit }
    );
  }

  /**
   * PERFORMANCE: Fetch new arrivals.
   * No client-side sorting. Backend handles 'ORDER BY createdAt DESC'.
   */
  async getNewArrivals(limit = 10): Promise<CursorPaginatedResponse<Product>> {
    return apiClient.get<CursorPaginatedResponse<Product>>(
      "/products",
      { limit, sortBy: "createdAt", sortOrder: "desc" }
    );
  }

  /**
   * SEARCH: Full-text search support.
   */
  async search(query: string, limit = 10): Promise<Product[]> {
    if (!query.trim()) return [];
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/products/search",
      { q: query, limit }
    );
    return response.data;
  }
}

export const productService = new ProductService();