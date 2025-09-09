// File: packages/dasboard/src/hooks/use-categories.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, Category } from "@/services/category-service";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth-context";
import { PRODUCTS_QUERY_KEY } from "./use-products";

// Define a query key for categories
export const CATEGORIES_QUERY_KEY = ["dashboard-categories"];

/**
 * Hook for fetching all categories.
 */
export function useCategories() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Category[]>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoryService.getCategories(),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

/**
 * Hook for assigning categories to a product.
 */
export function useAssignCategoriesToProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (variables: { productId: string; categoryIds: string[] }) =>
      categoryService.assignCategoriesToProduct(variables.productId, variables.categoryIds),
    onSuccess: () => {
      toast.success("Product categories updated successfully");
      // Invalidate both products and categories queries
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update categories");
    },
  });
}