import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewSchema } from "@/validation-schemas/review-schema";
import { toast } from "sonner";
import { reviewService } from "@/services/review-service";
import { ProductReviewsResponse } from "@/types/review";

// Query keys for caching
export const reviewKeys = {
  all: ["reviews"] as const,
  list: (productId: string) => [...reviewKeys.all, "list", productId] as const,
  detail: (reviewId: string) => [...reviewKeys.all, "detail", reviewId] as const,
};

// ✅ Hook to create a review
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewSchema) => reviewService.createReview(data),
    onSuccess: (createdReview) => {
      toast.success("Review submitted successfully!");

      // Invalidate only the product's reviews cache
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(createdReview.productId),
      });
    },
    onError: (error: any) => {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit review");
      }
    },
  });
}

// ✅ Hook to get product reviews - Fixed type
export function useProductReviews(productId: string) {
  return useQuery<ProductReviewsResponse, Error>({
    queryKey: reviewKeys.list(productId),
    queryFn: () => reviewService.getProductReviews(productId),
    enabled: !!productId,
    // staleTime: 5 * 60 * 1000,
  });
}