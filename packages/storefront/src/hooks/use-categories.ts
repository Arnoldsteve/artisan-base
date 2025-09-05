// REFACTOR: Custom hook for categories with React Query for better performance and caching

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import {
  Product,
  Category,
  ProductFilters,
  ProductSearchParams,
  PaginatedResponse,
} from "@/types";

// OPTIMIZATION: Query keys for better cache management
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  products: () => [...categoryKeys.all, "products"] as const,
  categoryProducts: (id: string, filters?: ProductSearchParams) =>
    [...categoryKeys.products(), id, filters] as const,
  categoryWithProducts: (id: string, filters?: ProductSearchParams) =>
    [...categoryKeys.all, "with-products", id, filters] as const,
  search: (categoryId: string, query: string) =>
    [...categoryKeys.all, "search", categoryId, query] as const,
};

// OPTIMIZATION: Individual category query with caching
export function useCategory(id: string, options?: UseQueryOptions<Category | null>) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

// OPTIMIZATION: Category products with pagination and filtering support
export function useCategoryProducts(
  categoryId: string,
  options: {
    filters?: ProductFilters;
    sortBy?: ProductFilters["sortBy"];
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  } = {},
  queryOptions?: UseQueryOptions<PaginatedResponse<Product>>
) {
  const { filters, sortBy, sortOrder, page = 1, limit = 12 } = options;

  return useQuery({
    queryKey: categoryKeys.categoryProducts(categoryId, {
      ...filters,
      sortBy,
      sortOrder,
      page,
      limit,
    }),
    queryFn: () =>
      categoryService.getProductsByCategoryId(categoryId, {
        filters,
        sortBy,
        sortOrder,
        page,
        limit,
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...queryOptions,
  });
}

// OPTIMIZATION: Infinite query for category products with large datasets
export function useInfiniteCategoryProducts(
  categoryId: string,
  options: {
    filters?: ProductFilters;
    sortBy?: ProductFilters["sortBy"];
    sortOrder?: "asc" | "desc";
    limit?: number;
  } = {}
) {
  const { filters, sortBy, sortOrder, limit = 12 } = options;

  return useInfiniteQuery({
    queryKey: categoryKeys.categoryProducts(categoryId, {
      ...filters,
      sortBy,
      sortOrder,
      limit,
    }),
    queryFn: ({ pageParam }) =>
      categoryService.getProductsByCategoryId(categoryId, {
        filters,
        sortBy,
        sortOrder,
        page: pageParam as number,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<Product>) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: (firstPage: PaginatedResponse<Product>) =>
      firstPage.meta.hasPrev ? firstPage.meta.page - 1 : undefined,
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// OPTIMIZATION: Simple category products hook (backward compatibility)
export function useCategoryProductsSimple(
  categoryId: string,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery({
    queryKey: categoryKeys.categoryProducts(categoryId),
    queryFn: () => categoryService.getProductsByCategoryIdSimple(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// OPTIMIZATION: Category with its products in one hook
export function useCategoryWithProducts(
  categoryId: string,
  options: {
    filters?: ProductFilters;
    sortBy?: ProductFilters["sortBy"];
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  } = {},
  queryOptions?: UseQueryOptions<{
    category: Category | null;
    products: PaginatedResponse<Product>;
  }>
) {
  const { filters, sortBy, sortOrder, page = 1, limit = 12 } = options;

  return useQuery({
    queryKey: categoryKeys.categoryWithProducts(categoryId, {
      ...filters,
      sortBy,
      sortOrder,
      page,
      limit,
    }),
    queryFn: () =>
      categoryService.getCategoryWithProducts(categoryId, {
        filters,
        sortBy,
        sortOrder,
        page,
        limit,
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...queryOptions,
  });
}

// OPTIMIZATION: Search products within a category
export function useCategoryProductSearch(
  categoryId: string,
  query: string,
  limit: number = 10,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery({
    queryKey: categoryKeys.search(categoryId, query),
    queryFn: () =>
      categoryService.searchProductsInCategory(categoryId, query, limit),
    enabled: !!categoryId && !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// OPTIMIZATION: Hook for filtered category products with memoization
export function useFilteredCategoryProducts(
  categoryId: string,
  filters: ProductFilters,
  options: {
    ssortBy?: ProductFilters["sortBy"];
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  } = {},
  queryOptions?: UseQueryOptions<PaginatedResponse<Product>>
) {
  return useQuery({
    queryKey: categoryKeys.categoryProducts(categoryId, {
      ...filters,
      ...options,
    }),
    queryFn: () =>
      categoryService.getProductsByCategoryId(categoryId, {
        filters,
        ...options,
      }),
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...queryOptions,
  });
}

// OPTIMIZATION: Get featured products from a specific category
export function useFeaturedCategoryProducts(
  categoryId: string,
  limit: number = 6,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery({
    queryKey: [...categoryKeys.categoryProducts(categoryId), "featured", limit],
    queryFn: async () => {
      const result = await categoryService.getProductsByCategoryId(categoryId, {
        filters: {},
        sortBy: "rating",
        sortOrder: "desc",
        limit: limit * 2, // Get more to filter from
      });
      
      // Return top rated or featured products from the category
      return result.data.slice(0, limit);
    },
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    ...options,
  });
}

// OPTIMIZATION: Get new arrivals from a specific category
export function useNewCategoryArrivals(
  categoryId: string,
  limit: number = 12,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery({
    queryKey: [...categoryKeys.categoryProducts(categoryId), "new-arrivals", limit],
    queryFn: async () => {
      const result = await categoryService.getProductsByCategoryId(categoryId, {
        filters: {},
        sortBy: "createdAt",
        sortOrder: "desc",
        limit,
      });
      
      return result.data;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes for freshness
    gcTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}