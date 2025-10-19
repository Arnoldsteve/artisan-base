import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUploadService } from "@/services/image-upload-service";
import { toast } from "sonner";
import { PRODUCTS_QUERY_KEY } from "./use-products";
import { Product } from "@/types/products";

interface UploadImagesVariables {
  productId: string;
  images: File[];
}

interface DeleteImageVariables {
  productId: string;
  imageId: string;
}

export function useUploadProductImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UploadImagesVariables) => {
      const { productId, images } = variables;

      const uploadPromises = images.map(async (file) => {
        try {
          const { signedUrl, path, fileId } =
            await imageUploadService.createSignedUploadUrl(
              productId,
              file.name,
              file.type
            );

          const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Direct upload failed for ${file.name}`);
          }

          return imageUploadService.finalizeUpload(productId, fileId, path);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
          } else {
            toast.error(`Failed to upload ${file.name}: Unknown error`);
          }
          return Promise.reject(error);
        }
      });

      const results = await Promise.all(uploadPromises);

      return results[results.length - 1] as Product;
    },

    onSuccess: (updatedProduct) => {
      toast.success(
        `Images for "${updatedProduct.name}" uploaded and saved successfully.`
      );

      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },

    onError: (error: Error) => {
      toast.error(
        error.message || "An unexpected error occurred during upload."
      );
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

    onSuccess: (updatedProduct: Product) => {
      toast.success(
        `Image deleted successfully from "${updatedProduct.name}".`
      );

      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, updatedProduct.id],
      });
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(`Failed to delete image: ${error.message}`);
      } else {
        toast.error("Failed to delete image: Unknown error");
      }
    },
  });
}
