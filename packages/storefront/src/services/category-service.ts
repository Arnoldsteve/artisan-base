import { apiClient } from "@/lib/api-client";
import {
  Product,
  Category,
  ProductFilters,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

// Helper function to normalize product data
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

export class CategoryService {
  // Filtering products
  private filterProducts(
    products: Product[],
    filters: ProductFilters = {}
  ): Product[] {
    return products.filter((product) => {
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }
      if (filters.rating && product.rating < filters.rating) {
        return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          product.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description
          ?.toLowerCase()
          .includes(searchTerm);
        const matchesTags = product.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm)
        );
        if (!matchesName && !matchesDescription && !matchesTags) return false;
      }
      if (!product.isActive) return false;
      return true;
    });
  }

  // Sorting products
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
      if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
      else return aValue < bValue ? 1 : -1;
    });
  }

  // Pagination
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
      const response = await apiClient.get<ApiResponse<Category>>(
        `/api/v1/storefront/categories/${id}`
      );
      return response.success && response.data ? response.data : null;
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

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Product>>
      >(`/api/v1/storefront/products`, {
        category: id,
        page,
        limit: Math.max(limit, 50),
        ...filters,
      });

      if (response.success && response.data) {
        const normalizedProducts = response.data.data.map(normalizeProduct);
        const filtered = this.filterProducts(normalizedProducts, filters);
        const sorted = this.sortProducts(filtered, sortBy, sortOrder);
        return this.paginateProducts(sorted, page, limit);
      }

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

  async getProductsByCategoryIdSimple(id: string): Promise<Product[]> {
    const result = await this.getProductsByCategoryId(id, { limit: 100 });
    return result.data;
  }

  async getCategoryWithProducts(
    id: string,
    options: {
      filters?: ProductFilters;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    category: Category | null;
    products: PaginatedResponse<Product>;
  }> {
    try {
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

  async searchProductsInCategory(
    categoryId: string,
    query: string,
    limit: number = 10
  ): Promise<Product[]> {
    if (!query.trim()) return [];
    const result = await this.getProductsByCategoryId(categoryId, {
      filters: { search: query },
      limit,
    });
    return result.data;
  }
}

export const categoryService = new CategoryService();
