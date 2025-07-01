import { Product } from "@/types/products";
import { getProducts } from "@/api/products";

/**
 * ProductService provides product search with in-memory caching for performance.
 */
class ProductService {
  private searchCache: Map<string, Product[]> = new Map();

  /**
   * Searches for products by name, with caching.
   * @param searchTerm - The product name to search for.
   * @returns A list of products matching the search term.
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    if (this.searchCache.has(searchTerm)) {
      return this.searchCache.get(searchTerm)!;
    }
    const response = await getProducts(1, 5, searchTerm);
    const products = response.data;
    this.searchCache.set(searchTerm, products);
    return products;
  }
}

export const productService = new ProductService();
