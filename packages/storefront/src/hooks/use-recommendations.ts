import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { recommendationService } from "@/services/recommendation-service";
import { Product } from "@/types";

export const recommendationKeys = {
  all: ["recommendations"] as const,
  lists: () => [...recommendationKeys.all, "list"] as const,
  // Recommendations are a "list" that depends on a specific product ID.
  list: (productId: string) => [...recommendationKeys.lists(), productId] as const,
};

export function useRecommendations(
  productId: string,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery({
    queryKey: recommendationKeys.list(productId),
    queryFn: () => recommendationService.getRecommendations(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, 
    gcTime: 15 * 60 * 1000,

    // Allow components to override these default options if needed
    ...options,
  });
}