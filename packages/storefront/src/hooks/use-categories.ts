"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import { useTenantContext } from "@/contexts/tenant-context";
import { Category, CategoryFilters } from "@/types/category";
// import { Category } from "@/types";

/**
 * TOP 1% ARCHITECTURE: Context-Aware Categories Hook
 * Automatically partitions the cache using the tenantId from the URL context.
 */
export const useCategories = (filters: CategoryFilters = {}, limit = 20) => {
  // 1. Detect Context: If null, we are in Global Marketplace mode.
  const { tenant, isLoading: isTenantLoading } = useTenantContext();

  const CATEGORIES_KEY = ["storefront-categories", tenant?.id];

  return useInfiniteQuery({
    queryKey: [...CATEGORIES_KEY, "list", filters, limit],
    queryFn: ({ pageParam }) =>
      categoryService.getCategories({
        ...filters,
        limit,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    
    // 2. Cursor Pagination Logic
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,

    // Wait for the URL slug to be resolved before fetching
    enabled: !isTenantLoading,
  });
};

/**
 * Hook for Single Category Details
 * @param id - The category ID or Slug
 * @param options - Standard React Query options (like initialData)
 */
export const useCategory = (
  id: string | null, 
  options: { initialData?: Category } = {} 
) => {
  const { tenant } = useTenantContext();

  return useQuery<Category>({
    queryKey: ["category-detail", tenant?.id, id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id && !!tenant?.id,
    ...options, 
  });
};;

/**
 * Hook for Top Categories (Navigation/Home Page)
 */
export const useTopCategories = (limit = 6) => {
  const { tenant } = useTenantContext();

  return useQuery<Category[]>({
    queryKey: ["top-categories", tenant?.id, limit],
    queryFn: () => categoryService.getTopCategories(limit),
  });
};