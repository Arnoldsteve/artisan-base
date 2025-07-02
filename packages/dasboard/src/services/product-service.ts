import { ProductRepository } from "./product-repository";
import { Product } from "@/types/products";
import { CreateProductDto, UpdateProductDto } from "@/types/products.dto";

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
    const response = await ProductRepository.getProducts(1, 5, searchTerm);
    const products = response.data;
    this.searchCache.set(searchTerm, products);
    return products;
  }

  async getProducts(page = 1, limit = 10, search?: string) {
    return ProductRepository.getProducts(page, limit, search);
  }

  async createProduct(productData: CreateProductDto) {
    return ProductRepository.createProduct(productData);
  }

  async updateProduct(id: string, productData: UpdateProductDto) {
    console.log("productData from service ProductRepository updateProduct", productData);
    return ProductRepository.updateProduct(id, productData);
  }

  async deleteProduct(id: string) {
    console.log("id from service ProductRepository deleteProduct", id);
    return ProductRepository.deleteProduct(id);
  }
}

export const productService = new ProductService();
