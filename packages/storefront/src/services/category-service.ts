import { apiClient } from "@/lib/api-client";
import { Category, CategoryFilters } from "@/types/category";
import { CursorPaginatedResponse, ApiResponse } from "@/types/shared";

/**
 * SOLID Principle: Single Responsibility
 * This service handles all data-fetching logic for Product Categories.
 */
export class CategoryService {
  /**
   * GLOBAL & TENANT: Fetch categories.
   * millions of users: Returns isolated categories if in a shop context header, 
   * or global categories if the header is absent.
   */
  async getCategories(
    params: CategoryFilters = {}
  ): Promise<CursorPaginatedResponse<Category>> {
    const categories = await apiClient.get<CursorPaginatedResponse<Category>>("/categories", params);
    console.debug(`[Client] Fetched categories with params:`, params, categories);
    return categories;  
  }

  /**
   * PUBLIC: Get a specific category by ID.
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }

  /**
   * TOP 1% SEO LOGIC: Resolve Category by URL Slug
   * millions of users: Critical for search engine ranking and user-friendly URLs.
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<any>(`/categories/slug/${slug}`);
    
    // Robust extraction: handles both wrapped { data } and direct objects
    const category = response?.data ? response.data : response;
    console.debug(`[Client] Fetched category for slug: ${slug}`, category);

    if (!category || !category.id) {
      throw new Error(`Category not found for slug: ${slug}`);
    }

    return category;
  }

  /**
   * ENTERPRISE FEATURE: Get categories with high product counts.
   */
  async getTopCategories(limit = 6): Promise<Category[]> {
    const response = await this.getCategories({ limit });
    return response.data;
  }
}

export const categoryService = new CategoryService();