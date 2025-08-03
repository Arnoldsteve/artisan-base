// File: packages/dasboard/src/hooks/use-image-uploads.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
// 1. IMPORT the new, correct service.
import { imageUploadService } from "@/services/image-upload-service";
import { toast } from "sonner";
import { PRODUCTS_QUERY_KEY } from "./use-products"; // Import the query key for invalidation

/**
 * Defines the structure for the image upload mutation variables.
 */
interface UploadImagesVariables {
  productId: string;
  images: File[];
}

interface DeleteImageVariables {
  productId: string;
  imageId: string;
}

/**
 * Hook for uploading images for a specific product via the backend API.
 *
 * This hook handles the mutation logic for uploading files, showing notifications,
 * and invalidating the relevant product queries upon success to refresh the UI.
 */
export function useUploadProductImages() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * The mutation function that performs the upload.
     * It expects an object with productId and an array of Files.
     */
    mutationFn: (variables: UploadImagesVariables) =>
      // 2. CALL the method from the new imageUploadService.
      imageUploadService.uploadProductImages(
        variables.productId,
        variables.images
      ),

    /**
     * onSuccess callback fires after a successful upload.
     * The backend returns the updated product, which is used here.
     */
    onSuccess: (updatedProduct) => {
      toast.success(
        `Images for "${updatedProduct.name}" uploaded successfully.`
      );

      // Invalidate queries to refetch product data and show the new images.
      // 1. Invalidate the main list of all products.
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });

      // 2. Invalidate the specific cache for this single product.
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },

    /**
     * onError callback fires if the mutation encounters an error.
     */
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload images.");
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeleteImageVariables) =>
      imageUploadService.deleteProductImage(
        variables.productId,
        variables.imageId
      ),
    onSuccess: (updatedProduct) => {
      toast.success("Image deleted successfully.");

      // Invalidate queries to refetch product data and show the updated image list.
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete image.");
    },
  });
}