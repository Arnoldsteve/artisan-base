import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import {
  Category,
  CursorPaginatedResponse,
  ProductSearchParams,
} from "@/types";

// Query keys for categories
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};

// Fetch single category
export function useCategory(
  id: string,
  options?: Partial<UseQueryOptions<Category | null>> & {
    initialData?: Category;
  }
) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    initialData: options?.initialData,
    ...options,
  });
}

// Fetch categories for normal sections (featured, homepage, etc.)
export function useCategories(params: ProductSearchParams = {}) {
  return useQuery<CursorPaginatedResponse<Category>>({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.getCategories(params),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

// Infinite scroll for categories
export function useInfiniteCategories(params: ProductSearchParams = {}) {
  return useInfiniteQuery({
    queryKey: categoryKeys.lists(),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      categoryService.getCategories({ cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: CursorPaginatedResponse<Category>) =>
      lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
