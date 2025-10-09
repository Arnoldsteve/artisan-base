import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product-service";
import { toast } from "sonner";
import { CreateProductDto, Product, UpdateProductDto } from "@/types/products";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types/shared";

// Define a query key to uniquely identify product data
export const PRODUCTS_QUERY_KEY = ["dashboard-products"];

/**
 * Hook for fetching a paginated list of products.
 * It is "auth-aware" and will not run until the user is authenticated.
 */
export function useProducts(
  page = 1,
  limit = 10,
  search = '',
  initialData?: PaginatedResponse<Product>
) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<Product>>({
    queryKey: [...PRODUCTS_QUERY_KEY, { page, limit, search }],
    queryFn: () => productService.getProducts(page, limit, search),
    enabled: !isAuthLoading && isAuthenticated,
    // Only use initialData for page 1, otherwise undefined
    initialData: page === 1 ? initialData : undefined,
    // Ensure data is always fresh when pagination changes
    staleTime: 0,
  });
}

/**
 * Hook for fetching a single product by its ID.
 */
export function useProduct(productId: string | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Product>({
    queryKey: [...PRODUCTS_QUERY_KEY, productId],
    queryFn: () => productService.getProductById(productId!),
    enabled: !isAuthLoading && isAuthenticated && !!productId,
  });
}

/**
 * Hook for creating a new product.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.createProduct(data),
    onSuccess: (newProduct) => {
      toast.success(`Product "${newProduct.name}" created successfully.`);
      // Invalidate the main products list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product.");
    },
  });
}

/**
 * Hook for updating an existing product.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; data: UpdateProductDto }) =>
      productService.updateProduct(variables.id, variables.data),
    onSuccess: (updatedProduct) => {
      toast.success(`Product "${updatedProduct.name}" updated successfully.`);
      // Invalidate both the list and the specific product's query cache
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product.");
    },
  });
}

/**
 * Hook for deleting a product.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product.");
    },
  });
}

/**
 * Hook for assigning categories to a product.
 */
export function useAssignCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, categoryIds }: { productId: string; categoryIds: string[] }) => {
      // Loop through each selected category and call POST
      for (const categoryId of categoryIds) {
        await productService.assignCategory(productId, categoryId); 
      }
    },
    onSuccess: () => {
      toast.success("Product categories updated successfully");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product categories");
    },
  });
}