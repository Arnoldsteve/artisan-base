"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product-service";
import { useTenantContext } from "@/contexts/tenant-context";
import { ProductFilters } from "@/types/product";

/**
 * TOP 1% ARCHITECTURE: Context-Aware Infinite Products Hook
 * This hook handles the discovery of millions of products using
 * Cursor-based pagination for maximum performance.
 */
export const useProducts = (filters: ProductFilters = {}, limit = 12) => {
  // 1. Detect Context: If tenantId exists, we are in a Storefront.
  // If null, we are in the Global Marketplace.
  const { tenant, isLoading: isTenantLoading } = useTenantContext();

  return useInfiniteQuery({
    /**
     * Cache Partitioning:
     * The key includes tenant.id, making the cache isolated per store.
     */
    queryKey: ["storefront-products", tenant?.id, filters],

    queryFn: ({ pageParam }) =>
      productService.getProducts({
        ...filters,
        limit,
        cursor: pageParam,
      }),

    initialPageParam: undefined as string | undefined,

    // 2. Cursor Logic: Tells TanStack Query how to find the next "page"
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,

    // Only fetch if we are not busy resolving the store from the URL
    enabled: !isTenantLoading,
  });
};

/**
 * Hook for Single Product Details by Slug
 */
export const useProductBySlug = (slug: string) => {
  const { tenant } = useTenantContext();

  return useQuery({
    // Key includes tenantId to ensure we get the right version of a product slug
    queryKey: ["product-detail", tenant?.id, slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // Detail pages are safe to cache for 5 mins
  });
};

/**
 * Hook for New Arrivals (Discovery Section)
 */
export const useNewArrivals = (limit = 10) => {
  const { tenant } = useTenantContext();

  return useQuery({
    queryKey: ["new-arrivals", tenant?.id, limit],
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 1000 * 60 * 10, // Arrivals are safe to cache longer
  });
};
