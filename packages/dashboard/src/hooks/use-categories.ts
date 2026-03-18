"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { categoryService } from "@/services/category-service";
import { toast } from "sonner";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types/categories";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types";

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Categories List
// ---------------------------------------------------------
export const useCategories = (initialLimit = 10, initialData?: PaginatedResponse<Category>) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  // Internal State for List Management
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const CATEGORIES_QUERY_KEY = ["categories", tenantId];

  // --- Fetch Query ---
  const categoriesQuery = useQuery({
    // Include tenantId for strict multi-tenant cache isolation
    queryKey: [...CATEGORIES_QUERY_KEY, "list", { page, search, limit: initialLimit }],
    queryFn: () => categoryService.getCategories(page, initialLimit, search),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
    initialData: page === 1 && !search ? initialData : undefined,
  });

  // --- Mutations ---
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.createCategory(data),
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success(`Category "${newCat.name}" created successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create category"),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["category", tenantId, updated.id] });
      toast.success(`Category "${updated.name}" updated.`);
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("Category deleted successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete category"),
  });

  // --- Return Unified Interface ---
  return {
    // Data & Meta
    categories: categoriesQuery.data?.data || [],
    meta: categoriesQuery.data?.meta,
    isLoading: categoriesQuery.isLoading,
    isFetching: categoriesQuery.isFetching,
    isError: categoriesQuery.isError,

    // State Management
    page,
    setPage,
    search,
    setSearch,

    // Actions
    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,

    updateCategory: updateCategoryMutation.mutate,
    isUpdating: updateCategoryMutation.isPending,

    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,
  };
};

// ---------------------------------------------------------
// 2. Hook for Single Category Details
// ---------------------------------------------------------
export const useCategory = (id: string | null) => {
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  return useQuery({
    queryKey: ["category", tenantId, id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId && !!id,
  });
};