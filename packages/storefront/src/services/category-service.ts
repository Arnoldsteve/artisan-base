import { apiClient } from "@/lib/api-client";
import { cleanParams } from "@/lib/clean-params";
import {
  Category,
  ApiResponse,
  CategorySearchParams,
  CursorPaginatedResponse,
} from "@/types";

export class CategoryService {
  async getCategories(
    params: CategorySearchParams = {}
  ): Promise<CursorPaginatedResponse<Category>> {
    const cleanedParams = cleanParams(params);

    const response = await apiClient.get<CursorPaginatedResponse<Category>>(
      "/api/v1/storefront/categories",
      cleanedParams
    );
    return response;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(
        `/api/v1/storefront/categories/${id}`
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error("Error fetching category by id:", error);
      return null;
    }
  }
}

export const categoryService = new CategoryService();
