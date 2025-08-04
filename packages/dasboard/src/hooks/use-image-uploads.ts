import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUploadService } from "@/services/image-upload-service";
import { toast } from "sonner";
import { PRODUCTS_QUERY_KEY } from "./use-products";
import { Product } from "@/types/products"; // Import Product type for clarity

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
 * Hook for uploading images using the secure, two-step signed URL process.
 */
export function useUploadProductImages() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * The mutation function now orchestrates the entire multi-step upload process for each file.
     */
    mutationFn: async (variables: UploadImagesVariables) => {
      const { productId, images } = variables;

      // We will run all file uploads in parallel for performance.
      const uploadPromises = images.map(async (file) => {
        try {
          // --- STEP 1: Get the secure upload URL from our backend ---
          const { signedUrl, path, fileId } =
            await imageUploadService.createSignedUploadUrl(
              productId,
              file.name,
              file.type,
            );

          // --- STEP 2: Upload the file directly to the signed URL (e.g., Supabase) ---
          const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Direct upload failed for ${file.name}`);
          }

          // --- STEP 3: Tell our backend to finalize the upload ---
          return imageUploadService.finalizeUpload(productId, fileId, path);

        } catch (error) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          // Propagate the error to let Promise.all know one of the uploads failed.
          return Promise.reject(error);
        }
      });

      // Wait for all finalization steps to complete.
      const results = await Promise.all(uploadPromises);
      
      // Return the result of the last successful finalization to update the UI.
      return results[results.length - 1] as Product;
    },

    /**
     * onSuccess now fires after all files have been successfully uploaded and finalized.
     */
    onSuccess: (updatedProduct) => {
      toast.success(
        `Images for "${updatedProduct.name}" uploaded and saved successfully.`
      );

      // Invalidate queries to refetch product data and show the new images.
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },

    /**
     * onError now catches failures in any part of the multi-step process.
     */
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred during upload.");
    },
  });
}

// THIS HOOK IS CORRECT - NO CHANGES NEEDED HERE
export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeleteImageVariables) =>
      imageUploadService.deleteProductImage(
        variables.productId,
        variables.imageId
      ),
    onSuccess: (updatedProduct) => {
      // ... (logic is correct)
    },
    onError: (error: Error) => {
      // ... (logic is correct)
    },
  });
}