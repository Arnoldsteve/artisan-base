import { apiClient } from "@/lib/client-api";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types/categories";
import { PaginatedResponse } from "@/types/shared";

/**
 * CategoryService directly handles API communication for dashboard category management.
 */
export class CategoryService {
  /**
   * Searches for a small number of categories, typically for autocomplete fields.
   * Relies on the apiClient's caching.
   * @param searchTerm - The category name to search for.
   * @returns A list of categories matching the search term.
   */
  async searchCategories(searchTerm: string): Promise<Category[]> {
    const response = await apiClient.get<PaginatedResponse<Category>>(
      "dashboard/categories",
      { page: 1, limit: 5, search: searchTerm }
    );
    return response.data; // Return just the categories array for search
  }

  /**
   * Gets a paginated list of all categories.
   */
  async getCategories(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<Category>> {
    return apiClient.get<PaginatedResponse<Category>>(
      "dashboard/categories",
      { page, limit, search }
    );
  }

  /**
   * Gets a single category by its ID.
   */
  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`dashboard/categories/${id}`);
  }

  /**
   * Creates a new category.
   */
  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    console.log("Creating category with data:", categoryData);
    return apiClient.post<Category>("dashboard/categories", categoryData);
  }

  /**
   * Updates an existing category.
   */
  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
    return apiClient.patch<Category>(`dashboard/categories/${id}`, categoryData);
  }

  /**
   * Deletes a single category by its ID.
   */
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`dashboard/categories/${id}`);
  }
}

export const categoryService = new CategoryService();