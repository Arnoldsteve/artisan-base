"use client";

import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { productService } from "@/services/product-service";
import { useTenantContext } from "@/contexts/tenant-context";
import { ProductFilters, Product } from "@/types/product";

/**
 * Hook for Listing Products (Infinite Scroll)
 */
export const useProducts = (filters: ProductFilters = {}, limit = 12) => {
  const { tenant, isLoading: isTenantLoading } = useTenantContext();

  return useInfiniteQuery({
    queryKey: ["storefront-products", tenant?.id, filters],
    queryFn: ({ pageParam }) =>
      productService.getProducts({
        ...filters,
        limit,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    enabled: !isTenantLoading,
  });
};

/**
 * FIX: Renamed from useProductBySlug to useProduct to resolve TS2724.
 * Includes optional support for initialData (SEO Hydration).
 */
export const useProduct = (slug: string, options?: { initialData?: Product }) => {
  const { tenant } = useTenantContext();

  return useQuery({
    queryKey: ["product-detail", tenant?.id, slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5, 
  });
};

/**
 * Hook for New Arrivals
 */
export const useNewArrivals = (limit = 10) => {
  const { tenant } = useTenantContext();

  return useQuery({
    queryKey: ["new-arrivals", tenant?.id, limit],
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 1000 * 60 * 10,
  });
};