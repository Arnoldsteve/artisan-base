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
  CursorPaginatedResponse,
  Category,
} from "@/types";

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

export function useProducts(
  params: ProductSearchParams = {},
  options?: UseQueryOptions<CursorPaginatedResponse<Product>>
) {
  return useQuery<CursorPaginatedResponse<Product>>({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useInfiniteProducts(params: ProductSearchParams = {}) {
  return useInfiniteQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      productService.getProducts({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: CursorPaginatedResponse<Product>) =>
      lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

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

export function useFeaturedProducts(limit: number = 12) {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useNewArrivals(limit: number = 12) {
  return useQuery({
    queryKey: productKeys.newArrivals(),
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery<CursorPaginatedResponse<Category>>({
    queryKey: productKeys.categories(),
    queryFn: () => productService.getCategories(),
  });
}
// staleTime: 30 * 60 * 1000,
// gcTime: 60 * 60 * 1000,

export function useInfiniteCategories(params: ProductSearchParams = {}) {
  return useInfiniteQuery({
    queryKey: productKeys.categories(),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      productService.getCategories({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined, 
    getNextPageParam: (lastPage: CursorPaginatedResponse<Category>) =>
      lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useProductSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFilteredProducts(filters: ProductSearchParams) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
