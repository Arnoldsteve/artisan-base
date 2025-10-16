// REFACTOR: CategoryService following Repository pattern and Single Responsibility Principle

import { apiClient } from "@/lib/api-client";
import {
  Product,
  Category,
  ProductFilters,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

// OPTIMIZATION: In-memory cache for categories and their products
class CategoryCache {
  private categories = new Map<string, Category>();
  private categoryProducts = new Map<string, Product[]>();
  private lastUpdate = 0;
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  setCategory(category: Category): void {
    this.categories.set(category.id, category);
  }

  getCategory(id: string): Category | null {
    return this.categories.get(id) || null;
  }

  setCategoryProducts(categoryId: string, products: Product[]): void {
    this.categoryProducts.set(categoryId, products);
    this.lastUpdate = Date.now();
  }

  getCategoryProducts(categoryId: string): Product[] | null {
    return this.categoryProducts.get(categoryId) || null;
  }

  isStale(): boolean {
    return Date.now() - this.lastUpdate > this.CACHE_TTL;
  }

  clear(): void {
    this.categories.clear();
    this.categoryProducts.clear();
    this.lastUpdate = 0;
  }

  clearCategoryProducts(categoryId: string): void {
    this.categoryProducts.delete(categoryId);
  }
}

// Add this helper function to normalize product data
function normalizeProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: Number(product.price) || 0,
    currency: product.currency || "KES",
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : undefined,
    image: product.image || (product.images && product.images[0]) || "",
    images: product.images || [],
    categories: product.categories || [],
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

// REFACTOR: CategoryService with business logic separation
export class CategoryService {
  private cache: CategoryCache;

  constructor() {
    this.cache = new CategoryCache();
  }

  // OPTIMIZATION: Efficient product filtering with O(n) complexity
  private filterProducts(
    products: Product[],
    filters: ProductFilters = {}
  ): Product[] {
    return products.filter((product) => {
     // Price range filter
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        if (filters.minPrice !== undefined && product.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
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

      // Only show active products
      if (!product.isActive) {
        return false;
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
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      // OPTIMIZATION: Check cache first
      // const cachedCategory = this.cache.getCategory(id);
      // if (cachedCategory) {
      //   return cachedCategory;
      // }

      const response = await apiClient.get<ApiResponse<Category>>(
        `/api/v1/storefront/categories/${id}`
      );

      if (response && response.success && response.data) {
        // this.cache.setCategory(response.data);
        return response.data || response;
      }

      return null;
    } catch (error) {
      console.error("Error fetching category by id:", error);
      return null;
    }
  }

  async getProductsByCategoryId(
    id: string,
    options: {
      filters?: ProductFilters;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    try {
      const { filters = {}, sortBy, sortOrder, page = 1, limit = 12 } = options;

      // OPTIMIZATION: Use cache for frequently accessed data
      if (!this.cache.isStale() && Object.keys(filters).length === 0) {
        const cachedProducts = this.cache.getCategoryProducts(id);
        if (cachedProducts) {
          const filtered = this.filterProducts(cachedProducts, filters);
          const sorted = this.sortProducts(filtered, sortBy, sortOrder);
          return this.paginateProducts(sorted, page, limit);
        }
      }

      // Fetch products by category from API
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
        `/api/v1/storefront/products`,
        { 
          category: id,
          page,
          limit: Math.max(limit, 50), // Get more for better filtering/sorting
          ...filters
        }
      );

      if (response && response.success && response.data) {
        // Normalize the products
        const normalizedProducts = response.data.data.map(normalizeProduct);
        
        // OPTIMIZATION: Cache the results for better performance
        if (Object.keys(filters).length === 0) {
          this.cache.setCategoryProducts(id, normalizedProducts);
        }

        // Apply client-side filtering and sorting if needed
        const filtered = this.filterProducts(normalizedProducts, filters);
        const sorted = this.sortProducts(filtered, sortBy, sortOrder);
        
        return this.paginateProducts(sorted, page, limit);
      }

      // Return empty result if no data
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error("Error fetching products by category id:", error);
      // Return empty result on error
      return {
        data: [],
        meta: {
          page: options.page || 1,
          limit: options.limit || 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  // OPTIMIZATION: Get products by category with simple array return (for backward compatibility)
  async getProductsByCategoryIdSimple(id: string): Promise<Product[]> {
    try {
      const result = await this.getProductsByCategoryId(id, { limit: 100 });
      return result.data;
    } catch (error) {
      console.error("Error fetching products by category id:", error);
      return [];
    }
  }

  // OPTIMIZATION: Get category with its products in one call
  async getCategoryWithProducts(
    id: string,
    options: {
      filters?: ProductFilters;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ category: Category | null; products: PaginatedResponse<Product> }> {
    try {
      // Fetch category and products concurrently
      const [category, products] = await Promise.all([
        this.getCategoryById(id),
        this.getProductsByCategoryId(id, options),
      ]);

      return { category, products };
    } catch (error) {
      console.error("Error fetching category with products:", error);
      return {
        category: null,
        products: {
          data: [],
          meta: {
            page: options.page || 1,
            limit: options.limit || 12,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
      };
    }
  }

  // OPTIMIZATION: Search products within a category
  async searchProductsInCategory(
    categoryId: string,
    query: string,
    limit: number = 10
  ): Promise<Product[]> {
    if (!query.trim()) return [];

    try {
      const result = await this.getProductsByCategoryId(categoryId, {
        filters: { search: query },
        limit,
      });

      return result.data;
    } catch (error) {
      console.error("Error searching products in category:", error);
      return [];
    }
  }

  // OPTIMIZATION: Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }

  // OPTIMIZATION: Clear cache for specific category
  clearCategoryCache(categoryId: string): void {
    this.cache.clearCategoryProducts(categoryId);
  }
}

// OPTIMIZATION: Singleton instance for better performance
export const categoryService = new CategoryService();