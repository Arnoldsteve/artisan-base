import { apiClient } from "@/lib/client-api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>("dashboard/categories");
  }

  async assignCategoriesToProduct(productId: string, categoryIds: string[]): Promise<void> {
    return apiClient.patch(`dashboard/products/${productId}/categories`, { categoryIds });
  }
}

export const categoryService = new CategoryService();