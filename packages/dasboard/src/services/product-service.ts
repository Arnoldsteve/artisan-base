import { apiClient } from "@/lib/client-api"; // Use the new client-side API client
import { Product, PaginatedResponse, CreateProductDto, UpdateProductDto } from "@/types/products";

/**
 * ProductService directly handles API communication for dashboard product management.
 */
export class ProductService {
  /**
   * Searches for a small number of products, typically for autocomplete fields.
   * Relies on the apiClient's caching.
   * @param searchTerm - The product name to search for.
   * @returns A list of products matching the search term.
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    // This now leverages the centralized cache in apiClient
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "dashboard/products",
      { page: 1, limit: 5, search: searchTerm }
    );
    return response.data; // Return just the products array for search
  }

  /**
   * Gets a paginated list of all products.
   */
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

  /**
   * Gets a single product by its ID.
   */
  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`dashboard/products/${id}`);
  }

  /**
   * Creates a new product.
   */
  async createProduct(productData: CreateProductDto): Promise<Product> {
    return apiClient.post<Product>("dashboard/products", productData);
  }

  /**
   * Updates an existing product.
   */
  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    return apiClient.patch<Product>(`dashboard/products/${id}`, productData);
  }

  /**
   * Deletes a single product by its ID.
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`dashboard/products/${id}`);
  }
}

export const productService = new ProductService();