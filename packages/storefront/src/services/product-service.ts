// REFACTOR: ProductService following Repository pattern and Single Responsibility Principle

import { apiClient } from "@/lib/api-client";
import {
  Product,
  Category,
  ProductFilters,
  ProductSearchParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

// OPTIMIZATION: In-memory cache for frequently accessed data
class ProductCache {
  private products = new Map<string, Product>();
  private categories = new Map<string, Category>();
  private featuredProducts: Product[] = [];
  private lastUpdate = 0;
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  setProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  getProduct(id: string): Product | null {
    return this.products.get(id) || null;
  }

  setProducts(products: Product[]): void {
    products.forEach((product) => this.products.set(product.id, product));
    this.lastUpdate = Date.now();
  }

  getProducts(): Product[] {
    return Array.from(this.products.values());
  }

  setCategories(categories: Category[]): void {
    categories.forEach((category) =>
      this.categories.set(category.id, category)
    );
  }

  getCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  setFeaturedProducts(products: Product[]): void {
    this.featuredProducts = products;
  }

  getFeaturedProducts(): Product[] {
    return this.featuredProducts;
  }

  isStale(): boolean {
    return Date.now() - this.lastUpdate > this.CACHE_TTL;
  }

  clear(): void {
    this.products.clear();
    this.categories.clear();
    this.featuredProducts = [];
    this.lastUpdate = 0;
  }
}

// Add this helper function at the top (after imports)
function normalizeProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: Number(product.price) || 0,
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : undefined,
    image: product.image || (product.images && product.images[0]) || "",
    images: product.images || [],
    category:
      product.category ||
      (product.categories && product.categories[0]?.name) ||
      "",
    categoryId: product.categoryId || "",
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    inventoryQuantity: product.inventoryQuantity ?? 0,
    sku: product.sku || "",
    tags: product.tags || [],
    isActive: product.isActive ?? true,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

// REFACTOR: ProductService with business logic separation
export class ProductService {
  private cache: ProductCache;

  constructor() {
    this.cache = new ProductCache();
  }

  // OPTIMIZATION: Efficient product filtering with O(n) complexity
  private filterProducts(
    products: Product[],
    filters: ProductFilters
  ): Product[] {
    return products.filter((product) => {
      // Category filter
      if (filters.category && product.categoryId !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.price < min || product.price > max) {
          return false;
        }
      }

      // Rating filter
      if (filters.rating && product.rating < filters.rating) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          product.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description
          ?.toLowerCase()
          .includes(searchTerm);
        const matchesTags = product.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm)
        );

        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }

  // OPTIMIZATION: Efficient sorting with stable sort algorithm
  private sortProducts(
    products: Product[],
    sortBy?: string,
    sortOrder: "asc" | "desc" = "desc"
  ): Product[] {
    if (!sortBy) return products;

    return [...products].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // OPTIMIZATION: Pagination with efficient slicing
  private paginateProducts(
    products: Product[],
    page: number = 1,
    limit: number = 12
  ): PaginatedResponse<Product> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: products.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getProducts(
    params: ProductSearchParams = {}
  ): Promise<PaginatedResponse<Product>> {
    try {
      // OPTIMIZATION: Use cache for frequently accessed data
      if (!this.cache.isStale() && !params.search && !params.category) {
        const cachedProducts = this.cache.getProducts();
        if (cachedProducts.length > 0) {
          const filtered = this.filterProducts(cachedProducts, params);
          const sorted = this.sortProducts(
            filtered,
            params.sortBy,
            params.sortOrder
          );
          return this.paginateProducts(sorted, params.page, params.limit);
        }
      }

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Product>>
      >("/api/v1/storefront/products", params);

      // OPTIMIZATION: Cache the results for better performance
      if (response.success) {
        this.cache.setProducts(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      // OPTIMIZATION: Check cache first
      const cachedProduct = this.cache.getProduct(id);
      if (cachedProduct) {
        return cachedProduct;
      }

      const response = await apiClient.get<ApiResponse<Product>>(
        `/api/v1/storefront/products/${id}`
      );

      if (response.success) {
        const normalized = normalizeProduct(response.data);
        this.cache.setProduct(normalized);
        return normalized;
      }

      throw new Error("Product not found");
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      // OPTIMIZATION: Use cache for featured products
      if (!this.cache.isStale()) {
        const cached = this.cache.getFeaturedProducts();
        if (cached.length > 0) {
          return cached.slice(0, limit);
        }
      }

      const response = await apiClient.get<ApiResponse<Product[]>>(
        "/api/v1/storefront/products/featured",
        { limit }
      );

      if (response.success) {
        this.cache.setFeaturedProducts(response.data);
        return response.data.slice(0, limit);
      }

      return [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  }

  // OPTIMIZATION: Get new arrivals sorted by creation date
  async getNewArrivals(limit: number = 12): Promise<Product[]> {
    try {
      // Get all products and sort by creation date
      const allProducts = await this.getProducts({ limit: 100 }); // Get more products to sort from
      const sortedProducts = this.sortProducts(
        allProducts.data,
        "createdAt",
        "desc"
      );

      return sortedProducts.slice(0, limit);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }
  }

  // This gives a list of all categories in the system
  async getCategories(): Promise<Category[]> {
    try {
      // OPTIMIZATION: Use cache for categories
      const cached = this.cache.getCategories();
      if (cached.length > 0) {
        return cached;
      }

      const response = await apiClient.get<ApiResponse<Category[]>>(
        "/api/v1/storefront/categories"
      );

      // FIX: Check if response has data instead of success
      console.log('categories with products from products services', response.data);
      if (response && response.data && Array.isArray(response.data)) {
        this.cache.setCategories(response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  // OPTIMIZATION: Search products with debouncing support
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    if (!query.trim()) return [];

    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        "/storefront/products/search",
        {
          q: query,
          limit,
        }
      );

      return response.success ? response.data : [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  // OPTIMIZATION: Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }
}

// OPTIMIZATION: Singleton instance for better performance
export const productService = new ProductService();
