"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { reviewService } from "@/services/review-service";
import { toast } from "sonner";
import { Review, CreateReviewDto } from "@/types/reviews";
import { useAuthContext } from "@/contexts/auth-context";

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Review List (Dashboard Moderation)
// ---------------------------------------------------------
export const useReviews = (initialLimit = 10) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  // Internal State for List Management
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const REVIEWS_QUERY_KEY = ["reviews", tenantId];

  // --- Fetch Query ---
  const reviewsQuery = useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, "list", { page, search, limit: initialLimit }],
    queryFn: () => reviewService.getAll(page, initialLimit, search), 
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
  });

  // --- Mutations (Moderation) ---
  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      // Invalidate the specific tenant's review cache
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
      toast.success("Review removed successfully.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to remove review"),
  });

  return {
    // Data & Meta
    reviews: reviewsQuery.data?.data || [],
    meta: reviewsQuery.data?.meta,
    isLoading: reviewsQuery.isLoading,
    isFetching: reviewsQuery.isFetching,
    isError: reviewsQuery.isError,

    // State Management
    page,
    setPage,
    search,
    setSearch,

    // Actions
    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isPending,
  };
};

// ---------------------------------------------------------
// 2. Hook for Product-Specific Reviews (Storefront)
// ---------------------------------------------------------
export const useProductReviews = (productId: string | null) => {
  const { tenantId } = useAuthContext();

  return useQuery({
    queryKey: ["reviews", tenantId, "product", productId],
    queryFn: () => reviewService.getByProduct(productId!),
    enabled: !!tenantId && !!productId,
    placeholderData: keepPreviousData,
  });
};

// ---------------------------------------------------------
// 3. Hook for Rating Summary (Star Aggregates)
// ---------------------------------------------------------
export const useReviewSummary = (productId: string | null) => {
  const { tenantId } = useAuthContext();

  return useQuery({
    queryKey: ["reviews", tenantId, "summary", productId],
    queryFn: () => reviewService.getSummary(productId!),
    enabled: !!tenantId && !!productId,
    // staleTime: 1000 * 60 * 5, // Cache summary for 5 mins (High-Scale optimization)
  });
};