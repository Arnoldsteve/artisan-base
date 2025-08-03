// File: packages/dasboard/src/services/image-upload-service.ts

import { apiClient } from "@/lib/client-api";
import { Product } from "@/types/products"; // The API should return the updated product

/**
 * ImageUploadService handles the API communication for uploading product images.
 * It sends files to the backend, which then processes and stores them.
 */
// ... (imports are the same)

export class ImageUploadService {
  // ... (existing uploadProductImages method is the same)
  async uploadProductImages(
    productId: string,
    images: File[]
  ): Promise<Product> {
    const formData = new FormData();
    images.forEach((imageFile) => {
      formData.append("images", imageFile);
    });
    const endpoint = `/dashboard/products/${productId}/upload-images`;
    return apiClient.post<Product>(endpoint, formData);
  }

  // --- ADD THIS NEW METHOD ---
  /**
   * Deletes a specific image from a product.
   *
   * @param productId - The ID of the product.
   * @param imageId - The ID of the image to be deleted.
   * @returns The updated product after the image has been removed.
   */
  async deleteProductImage(
    productId: string,
    imageId: string
  ): Promise<Product> {
    // This calls an endpoint like: DELETE /api/dashboard/products/prod_123/images/img_456
    const endpoint = `/dashboard/products/${productId}/images/${imageId}`;
    return apiClient.delete<Product>(endpoint);
  }
}

export const imageUploadService = new ImageUploadService();