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

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Product List
// ---------------------------------------------------------
export const useProducts = (initialLimit = 10) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const PRODUCTS_QUERY_KEY = ["products", tenantId];

  // --- Fetch Query ---
  const productsQuery = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, "list", { page, search, limit: initialLimit }],
    queryFn: () => productService.getProducts(page, initialLimit, search),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
  });

  // --- Mutations ---
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductDto) => productService.createProduct(data),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success(`Product "${newProduct.name}" created successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create product"),
  });

  const bulkCreateMutation = useMutation({
    mutationFn: (data: CreateProductDto[]) => productService.bulkCreateProducts(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success(`${res.count} products created successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Bulk upload failed"),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productService.updateProduct(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["product", tenantId, updated.id] });
      toast.success(`Product "${updated.name}" updated.`);
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
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