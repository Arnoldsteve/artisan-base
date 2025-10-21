import { apiClient } from "@/lib/client-api"; // Use the new client-side API client
import { Product, CreateProductDto, UpdateProductDto, AssignCategoriesToProductDto } from "@/types/products";
import { PaginatedResponse } from "@/types/shared";


export class ProductService {
  /**
   * Searches for a small number of products, typically for autocomplete fields.
   * Relies on the apiClient's caching.
   * @param searchTerm - The product name to search for.
   * @returns A list of products matching the search term.
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "dashboard/products",
      { page: 1, limit: 5, search: searchTerm }
    );
    return response.data;
  }

  async getProducts(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(
      "dashboard/products",
      { page, limit, search }
    );
  }

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`dashboard/products/${id}`);
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    return apiClient.post<Product>("dashboard/products", productData);
  }

  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    return apiClient.patch<Product>(`dashboard/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`dashboard/products/${id}`);
  }

  async assignCategories(productId: string, dto: AssignCategoriesToProductDto): Promise<void> {
    await apiClient.patch(`/dashboard/products/${productId}/categories`, dto);
  }

  async assignCategory(productId: string, categoryId: string): Promise<void> {
    await apiClient.post("/dashboard/product-categories", { productId, categoryId });
  }

  // async unassignCategory(productId: string, categoryId: string): Promise<void> {
  //   await apiClient.delete("/dashboard/product-categories", { data: { productId, categoryId } });
  // }


}

export const productService = new ProductService();