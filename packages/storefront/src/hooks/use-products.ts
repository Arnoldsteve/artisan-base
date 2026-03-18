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


/**
 * TOP 1% ARCHITECTURE: Context-Aware Featured Products
 * millions of users: Fetches store-specific featured items if in a shop context,
 * or global featured items if in marketplace mode.
 */
export const useFeaturedProducts = (params: { limit?: number } = {}) => {
  const { tenant, isLoading: isTenantLoading } = useTenantContext();

  return useQuery({
    queryKey: ["featured-products", tenant?.id, params.limit],    
    queryFn: () => productService.getFeaturedProducts(params),    
    enabled: !isTenantLoading,
    
  });
};

/**
 * TOP 1% ARCHITECTURE: Infinite Featured Products
 * millions of users: Optimized for "Load More" browsing of curated items.
 */
export const useInfiniteFeaturedProducts = (limit = 12) => {
  const { tenant, isLoading: isTenantLoading } = useTenantContext();

  return useInfiniteQuery({
    // Cache Partitioning: Isolate marketplace featured vs store featured
    queryKey: ["featured-products-infinite", tenant?.id, limit],
    
    queryFn: ({ pageParam }) =>
      productService.getFeaturedProducts({
        limit,
        cursor: pageParam,
      }),
      
    initialPageParam: undefined as string | undefined,
    
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,

    enabled: !isTenantLoading,
  });
};

/**
 * TOP 1% ARCHITECTURE: Infinite New Arrivals
 * millions of users: Fetches products sorted by 'createdAt' descending.
 * Automatically handles Tenant Isolation vs Global Marketplace modes.
 */
export const useInfiniteNewArrivals = (limit = 12) => {
  const { tenant, isLoading: isTenantLoading } = useTenantContext();

  return useInfiniteQuery({
    queryKey: ["new-arrivals-infinite", tenant?.id, limit],
    
    queryFn: ({ pageParam }) =>
      productService.getProducts({
        limit,
        cursor: pageParam,
        sortBy: "createdAt", // Database-level sorting
        sortOrder: "desc",
      }),
      
    initialPageParam: undefined as string | undefined,
    
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,

    enabled: !isTenantLoading,
  });
};