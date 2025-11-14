import { apiClient } from "@/lib/api-client";
import { cleanParams } from "@/lib/clean-params";
import {
  Product,
  Category,
  ProductFilters,
  ProductSearchParams,
  PaginatedResponse,
  ApiResponse,
  CursorPaginatedResponse,
} from "@/types";

// Helper function to normalize product
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

export class ProductService {
  constructor() {}

  private filterProducts(
    products: Product[],
    filters: ProductFilters
  ): Product[] {
    return products.filter((product) => {
      if (filters.category && product.categoryId !== filters.category)
        return false;
      if (filters.minPrice !== undefined && product.price < filters.minPrice)
        return false;
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice)
        return false;
      if (filters.rating && product.rating < filters.rating) return false;
      if (
        filters.tags?.length &&
        !filters.tags.some((tag) => product.tags.includes(tag))
      )
        return false;
      if (filters.search) {
        const term = filters.search.toLowerCase();
        if (
          !product.name.toLowerCase().includes(term) &&
          !product.description?.toLowerCase().includes(term) &&
          !product.tags.some((tag) => tag.toLowerCase().includes(term))
        )
          return false;
      }
      return true;
    });
  }

  private sortProducts(
    products: Product[],
    sortBy?: string,
    sortOrder: "asc" | "desc" = "desc"
  ): Product[] {
    if (!sortBy) return products;
    return [...products].sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
          ? 1
          : -1;
    });
  }

  private paginateProducts(
    products: Product[],
    page = 1,
    limit = 12
  ): PaginatedResponse<Product> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    return {
      data: products.slice(start, end),
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

  async getProducts(
    params: ProductSearchParams = {}
  ): Promise<CursorPaginatedResponse<Product>> {
    const cleanedParams = cleanParams(params);

    const response = await apiClient.get<CursorPaginatedResponse<Product>>(
      "/api/v1/storefront/products",
      cleanedParams
    );

    return response; 
  }

  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/api/v1/storefront/products/${id}`
    );
    if (response.success) return normalizeProduct(response.data);
    throw new Error("Product not found");
  }

  async getFeaturedProducts(limit = 12): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/api/v1/storefront/products/featured",
      { limit }
    );
    return response.success ? response.data.slice(0, limit) : [];
  }

  async getNewArrivals(limit = 24): Promise<Product[]> {
    const allProducts = await this.getProducts({ limit: 100 });
    return this.sortProducts(allProducts.data, "createdAt", "desc").slice(
      0,
      limit
    );
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      "/api/v1/storefront/categories"
    );
    return response.data || [];
  }

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    if (!query.trim()) return [];
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/storefront/products/search",
      { q: query, limit }
    );
    return response.success ? response.data : [];
  }

  async getProductBySlug(slug: string) {
    return apiClient.get<ApiResponse<Product>>(
      `/api/v1/storefront/products/slug/${slug}`
    );
  }
}

export const productService = new ProductService();
