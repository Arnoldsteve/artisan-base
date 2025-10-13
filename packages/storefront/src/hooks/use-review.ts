// src/hooks/use-review.ts
import { useQuery } from "@tanstack/react-query";
import { reviewService, Review } from "@/services/review";

export function useProductReviews(productId: string | undefined) {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () =>
      productId ? reviewService.getProductReviews(productId) : Promise.resolve([]),
    enabled: !!productId,
  });
}
