// File: packages/dashboard/src/hooks/use-categories.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import { toast } from "sonner";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types/categories";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types/shared";

// Unique key for react-query cache
export const CATEGORIES_QUERY_KEY = ["dashboard-categories"];

/**
 * Fetch paginated categories (auth-aware).
 */
export function useCategories(
  page = 1,
  limit = 10,
  search = "",
  initialData?: PaginatedResponse<Category>
) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<Category>>({
    queryKey: [...CATEGORIES_QUERY_KEY, { page, limit, search }],
    queryFn: () => categoryService.getCategories(page, limit, search),
    enabled: !isAuthLoading && isAuthenticated,
    initialData,
  });
}

/**
 * Fetch a single category by ID.
 */
export function useCategory(categoryId: string | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Category>({
    queryKey: [...CATEGORIES_QUERY_KEY, categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId!),
    enabled: !isAuthLoading && isAuthenticated && !!categoryId,
  });
}

/**
 * Create a new category.
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.createCategory(data),
    onSuccess: (newCategory) => {
      toast.success(`Category "${newCategory.name}" created successfully.`);
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category.");
    },
  });
}

/**
 * Update an existing category.
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; data: UpdateCategoryDto }) =>
      categoryService.updateCategory(variables.id, variables.data),
    onSuccess: (updatedCategory) => {
      toast.success(`Category "${updatedCategory.name}" updated successfully.`);
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CATEGORIES_QUERY_KEY, updatedCategory.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category.");
    },
  });
}

/**
 * Delete a category.
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category.");
    },
  });
}
