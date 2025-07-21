import { Category, Product, ApiResponse } from "@/types";
import { apiClient } from "@/lib/api-client";

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/api/v1/storefront/categories/${id}`
    );
    if (response && response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category by id:", error);
    return null;
  }
}

export async function getProductsByCategoryId(id: string): Promise<Product[]> {
  try {
    // Assuming the API supports filtering by categoryId
    const response = await apiClient.get<ApiResponse<{ data: Product[] }>>(
      `/api/v1/storefront/products`,
      { category: id }
    );
    if (response && response.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products by category id:", error);
    return [];
  }
}
