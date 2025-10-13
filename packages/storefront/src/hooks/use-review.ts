import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewSchema } from "@/validation-schemas/review-schema";
import { toast } from "sonner";
import { reviewService, Review } from "@/services/review-service";

// Query keys for caching
export const reviewKeys = {
  all: ["reviews"] as const,
  list: (productId: string) => [...reviewKeys.all, "list", productId] as const,
  detail: (reviewId: string) => [...reviewKeys.all, "detail", reviewId] as const,
};

// Hook to create a review
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewSchema) => reviewService.createReview(data),
    onSuccess: (createdReview) => {
      toast.success("Review submitted successfully!");
      // Invalidate only the product's reviews
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(createdReview.productId),
      });
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });
}

export function useProductReviews(productId: string) {
  return useQuery<Review[], Error>({
    queryKey: reviewKeys.list(productId),
    queryFn: () => reviewService.getProductReviews(productId),
    enabled: !!productId, 
    staleTime: 5 * 60 * 1000, 
    // onError: (error: Error) => {
    //   toast.error("Failed to load product reviews");
    //   console.error(error);
    // },
  });
}
