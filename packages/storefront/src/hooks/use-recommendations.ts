import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { recommendationService } from "@/services/recommendation-service";
import { Product } from "@/types";

// ===================================================================
// STEP 1: Create structured query keys, just like in use-products.ts
// ===================================================================
export const recommendationKeys = {
  all: ["recommendations"] as const,
  lists: () => [...recommendationKeys.all, "list"] as const,
  // Recommendations are a "list" that depends on a specific product ID.
  list: (productId: string) => [...recommendationKeys.lists(), productId] as const,
};

// ===================================================================
// STEP 2: Create the hook using the new query keys and best practices
// ===================================================================
/**
 * A hook to fetch product recommendations for a specific product ID.
 * It follows the existing architectural pattern for data fetching in this app,
 * using TanStack Query for caching and state management.
 *
 * @param productId The ID of the product to get recommendations for.
 * @param options Optional TanStack Query options to override defaults.
 * @returns The result of the useQuery hook.
 */
export function useRecommendations(
  productId: string,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery({
    // Use the structured key for type safety and consistency
    queryKey: recommendationKeys.list(productId),

    // The function that calls our clean service layer
    queryFn: () => recommendationService.getRecommendations(productId),

    // === Options (Mirroring the best practices in your other hooks) ===

    // The query will not run until a productId is available
    enabled: !!productId,

    // Recommendations don't change very often for a given product.
    // We can consider them "stale" after 5 minutes.
    staleTime: 5 * 60 * 1000, // 5 minutes

    // The data will be garbage collected from the cache after 15 minutes of inactivity.
    gcTime: 15 * 60 * 1000, // 15 minutes

    // Allow components to override these default options if needed
    ...options,
  });
}