import { apiClient } from "@/lib/client-api";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/categories";
import { PaginatedResponse } from "@/types/shared";

export class CategoryService {
  // Search categories with query param ?search=term

  async searchCategories(searchTerm: string): Promise<Category[]> {
    // console.log("search category api response in service", searchTerm);
    const response = await apiClient.get<Category[]>("dashboard/categories", { 
      search: searchTerm,
      page: 1,
      limit: 5,
    });
    // console.log("search category api response in service", response);
    return response; 
  }
  // Get paginated categories (with optional search)
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
