import { apiClient } from "@/lib/client-api";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/categories";
import { PaginatedResponse } from "@/types/shared";

export class CategoryService {
  async searchCategories(searchTerm: string): Promise<Category[]> {
    console.log("Creating category with data:", searchTerm);

    const response = await apiClient.get<PaginatedResponse<Category>>(
      "dashboard/categories",
      { page: 1, limit: 5, search: searchTerm }
    );
    return response.data;
  }

  async getCategories(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<Category>> {
    return apiClient.get<PaginatedResponse<Category>>("dashboard/categories", {
      page,
      limit,
      search,
    });
  }

  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`dashboard/categories/${id}`);
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    console.log("Creating category with data:", categoryData);
    return apiClient.post<Category>("dashboard/categories", categoryData);
  }

  async updateCategory(
    id: string,
    categoryData: UpdateCategoryDto
  ): Promise<Category> {
    return apiClient.patch<Category>(
      `dashboard/categories/${id}`,
      categoryData
    );
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`dashboard/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
