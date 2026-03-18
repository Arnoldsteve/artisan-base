import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { recommendationService } from "@/services/recommendation-service";
import { Product } from "@/types/product"; 

export const recommendationKeys = {
  all: ["recommendations"] as const,
  lists: () => [...recommendationKeys.all, "list"] as const,
  list: (productId: string) => [...recommendationKeys.lists(), productId] as const,
};

export function useRecommendations(
  productId: string,
  options?: UseQueryOptions<Product[]>
) {
  return useQuery<Product[]>({
    queryKey: recommendationKeys.list(productId),
    queryFn: () => recommendationService.getRecommendations(productId),
    enabled: !!productId,
    ...options,
  });
}