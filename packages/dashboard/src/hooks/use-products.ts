"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { productService } from "@/services/product-service";
import { toast } from "sonner";
import { CreateProductDto, Product, UpdateProductDto } from "@/types/products";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types";

export const PRODUCTS_QUERY_KEY = ["products"] as const;


// ---------------------------------------------------------
// 1. Unified Hook for Managing the Product List
// ---------------------------------------------------------
export const useProducts = (initialLimit = 10, initialData?: PaginatedResponse<Product>) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const scopedKey = [...PRODUCTS_QUERY_KEY, tenantId];

  // --- Fetch Query ---
  const productsQuery = useQuery({
    queryKey: [...scopedKey, "list", { page, search, limit: initialLimit }],
    queryFn: () => productService.getProducts(page, initialLimit, search),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
      initialData: page === 1 && !search ? initialData : undefined, 
  });

  // --- Mutations ---
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductDto) => productService.createProduct(data),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: scopedKey });
      toast.success(`Product "${newProduct.name}" created successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create product"),
  });

  const bulkCreateMutation = useMutation({
    mutationFn: (data: CreateProductDto[]) => productService.bulkCreateProducts(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: scopedKey });
      toast.success(`${res.count} products created successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Bulk upload failed"),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productService.updateProduct(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: scopedKey });
      queryClient.invalidateQueries({ queryKey: ["product", tenantId, updated.id] });
      toast.success(`Product "${updated.name}" updated.`);
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scopedKey });
      toast.success("Product deleted successfully");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  return {
    products: productsQuery.data?.data || [],
    meta: productsQuery.data?.meta,
    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    isError: productsQuery.isError,

    page,
    setPage,
    search,
    setSearch,

    createProduct: createProductMutation.mutate,
    isCreating: createProductMutation.isPending,

    bulkCreate: bulkCreateMutation.mutate,
    isBulkCreating: bulkCreateMutation.isPending,

    updateProduct: updateProductMutation.mutate,
    isUpdating: updateProductMutation.isPending,

    deleteProduct: deleteProductMutation.mutate,
    isDeleting: deleteProductMutation.isPending,
  };
};

// ---------------------------------------------------------
// 2. Hook for Single Product Details
// ---------------------------------------------------------
export const useProduct = (id: string | null) => {
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  return useQuery({
    queryKey: ["product", tenantId, id],
    queryFn: () => productService.getProductById(id!),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId && !!id,
  });
};

// ... existing useProduct hook

// ⚡ 3. THE FIX: Standalone Hook for Category Assignment
export const useAssignCategories = () => {
  const queryClient = useQueryClient();
  const { tenantId } = useAuthContext();

  return useMutation({
    mutationFn: ({ 
      productId, 
      categoryIds 
    }: { 
      productId: string; 
      categoryIds: string[] 
    }) => productService.assignCategories(productId, categoryIds),
    
    onSuccess: (_, variables) => {
      // 🎯 TOP 1% PATTERN: Invalidate both list and specific product cache
      // This ensures the new badges show up everywhere instantly
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ 
        queryKey: ["product", tenantId, variables.productId] 
      });
      
      toast.success("Product categories updated successfully.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update categories");
    },
  });
};