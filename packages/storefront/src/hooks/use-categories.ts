import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import {
  Category,
  CategorySearchParams,
  CursorPaginatedResponse,
  ProductSearchParams,
} from "@/types";

// Query keys for categories
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: CategorySearchParams) =>
    [...categoryKeys.lists(), filters] as const,
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
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

// Infinite scroll for categories
export function useInfiniteCategories(params: CategorySearchParams = {}) {
  return useInfiniteQuery({
    queryKey: categoryKeys.list(params),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      categoryService.getCategories({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: CursorPaginatedResponse<Category>) =>
      lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
