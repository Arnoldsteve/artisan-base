import { apiClient } from "@/lib/api-client";
import { Product, ProductFilters } from "@/types/product";
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
    params: ProductFilters & { limit?: number; cursor?: string } = {},
  ): Promise<CursorPaginatedResponse<Product>> {
    return apiClient.get<CursorPaginatedResponse<Product>>("/products", params);
  }

  /**
   * PUBLIC: Get a specific product by its URL slug.
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<any>(`/products/slug/${slug}`);

    /**
     * TOP 1% LOGIC: Flexible Extraction
     * We check if the backend wrapped the result in a 'data' property.
     * If yes, return 'response.data'. If no, return the 'response' itself.
     */
    const product = response?.data ? response.data : response;
    console.log("Fetched product:", product); // Debugging log

    // Safety check for the storefront
    if (!product || !product.id) {
      throw new Error(`Product not found for slug: ${slug}`);
    }

    return product;
  }

  /**
   * PERFORMANCE: Fetch featured products.
   * Backend uses an 'isFeatured' index for sub-millisecond response.
   */
/**
 * ⚡ Enterprise Refactor: Support Object-based params for Cursors
 */
  async getFeaturedProducts(params: { 
    limit?: number; 
    cursor?: string 
  } | number = 5): Promise<CursorPaginatedResponse<Product>> {
    
    // Handle backward compatibility for when a raw number is passed
    const queryParams = typeof params === 'number' 
      ? { limit: params } 
      : params;

    return apiClient.get<CursorPaginatedResponse<Product>>("/products/featured", {
      params: queryParams
    });
  }

  /**
   * PERFORMANCE: Fetch new arrivals.
   * No client-side sorting. Backend handles 'ORDER BY createdAt DESC'.
   */
  async getNewArrivals(limit = 10): Promise<CursorPaginatedResponse<Product>> {
    return apiClient.get<CursorPaginatedResponse<Product>>("/products", {
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }

  /**
   * SEARCH: Full-text search support.
   */
  async search(query: string, limit = 10): Promise<Product[]> {
    if (!query.trim()) return [];
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/products/search",
      { q: query, limit },
    );
    return response.data;
  }
}

export const productService = new ProductService();
