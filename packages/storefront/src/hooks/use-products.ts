// REFACTOR: Custom hook for products with React Query for better performance and caching

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { productService } from "@/services/product-service";
import {
  Product,
  ProductSearchParams,
  PaginatedResponse,
  Category,
} from "@/types";

// OPTIMIZATION: Query keys for better cache management
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductSearchParams) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, "featured"] as const,
  newArrivals: () => [...productKeys.all, "new-arrivals"] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
};

// OPTIMIZATION: Custom hook for products with infinite scrolling support
export function useProducts(
  params: ProductSearchParams = {},
  options?: UseQueryOptions<PaginatedResponse<Product>>
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// OPTIMIZATION: Infinite query for better performance with large datasets
export function useInfiniteProducts(
  params: Omit<ProductSearchParams, "page"> = {}
) {
  return useInfiniteQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ pageParam }) =>
      productService.getProducts({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<Product>) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: (firstPage: PaginatedResponse<Product>) =>
      firstPage.meta.hasPrev ? firstPage.meta.page - 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// OPTIMIZATION: Individual product query with caching
export function useProduct(
  id: string,
  options?: Partial<UseQueryOptions<Product>> & { initialData?: Product }
) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    initialData: options?.initialData,
    ...options,
  });
}

// OPTIMIZATION: Featured products with longer cache time
export function useFeaturedProducts(limit: number = 12) {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// OPTIMIZATION: New arrivals with shorter cache time for freshness
export function useNewArrivals(limit: number = 12) {
  return useQuery({
    queryKey: productKeys.newArrivals(),
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes for freshness
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// OPTIMIZATION: Categories with long cache time since they rarely change
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// OPTIMIZATION: Search with debouncing support
export function useProductSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// OPTIMIZATION: Hook for filtered products with memoization
export function useFilteredProducts(filters: ProductSearchParams) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
