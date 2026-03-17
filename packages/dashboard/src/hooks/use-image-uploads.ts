"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUploadService } from "@/services/image-upload-service";
import { toast } from "sonner";
import { PRODUCTS_QUERY_KEY } from "./use-products"; // Assuming ["products"]
import { Product } from "@/types/products";
import { 
  UploadProductImagesVariables, 
  DeleteProductImagePayload 
} from "@/types/image-upload";

/**
 * HOOK: Handles bulk image uploads for a specific product.
 * millions of users: Orchestrates the 3-step handshake (Sign -> PUT -> Finalize)
 * for multiple files in parallel.
 */
export function useUploadProductImages() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UploadProductImagesVariables>({
    mutationFn: async ({ productId, images }) => {
      // 🚀 Process all images in parallel for maximum performance
      const uploadPromises = images.map(async (file) => {
        // 1. Get Permission (Signed URL)
        const { signedUrl, path, fileId } =
          await imageUploadService.createSignedUploadUrl(
            productId,
            file.name,
            file.type
          );

        // 2. Upload Binary Directly to Storage (S3/Supabase)
        await imageUploadService.uploadBinary(signedUrl, file);

        // 3. Finalize in DB
        return imageUploadService.finalizeUpload({
          productId,
          fileId,
          path,
        });
      });

      const results = await Promise.all(uploadPromises);

      // Return the final state of the product after the last image is processed
      return results[results.length - 1];
    },

    onSuccess: (updatedProduct) => {
      toast.success(`Images for "${updatedProduct.name}" saved successfully.`);

      // ⚡ Invalidate both list and specific product cache
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Institutional upload failed. Please try again.");
    },
  });
}

/**
 * HOOK: Removes a specific image from a product.
 */
export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, DeleteProductImagePayload>({
    mutationFn: ({ productId, imageId }) =>
      imageUploadService.deleteProductImage(productId, imageId),

    onSuccess: (updatedProduct) => {
      toast.success("Image removed successfully.");

      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete image.");
    },
  });
}