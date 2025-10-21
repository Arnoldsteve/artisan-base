import { apiClient } from "@/lib/client-api";
import { Product } from "@/types/products";

interface SignedUrlResponse {
  signedUrl: string; // The URL to upload the file to
  path: string;      // The path of the file in Supabase storage
  fileId: string;    // The unique ID for the image record
}


export class ImageUploadService {
  /**
   * STEP 1: Asks the backend for a secure, one-time URL to upload a file to.
   *
   * @param productId The ID of the product to associate the image with.
   * @param fileName The name of the file being uploaded.
   * @param fileType The MIME type of the file (e.g., 'image/png').
   * @returns A promise that resolves with the signed URL and necessary metadata.
   */
  async createSignedUploadUrl(
    productId: string,
    fileName: string,
    fileType: string,
  ): Promise<SignedUrlResponse> {
    const endpoint = '/dashboard/storage/upload-url';
    return apiClient.post<SignedUrlResponse>(endpoint, {
      productId,
      fileName,
      fileType,
    });
  }

  /**
   * STEP 2: After the client uploads the file directly to the signed URL,
   * this method tells the backend to finalize the process and save the image record to the product.
   *
   * @param productId The ID of the product.
   * @param fileId The unique ID for the image, received from createSignedUploadUrl.
   * @param path The storage path for the image, received from createSignedUploadUrl.
   * @returns The updated product with the new image linked.
   */
  async finalizeUpload(
    productId: string,
    fileId: string,
    path: string,
  ): Promise<Product> {
    const endpoint = '/dashboard/storage/finalize-upload';
    return apiClient.post<Product>(endpoint, {
      productId,
      fileId,
      path,
    });
  }

  /**
   * Deletes a specific image from a product by calling the backend endpoint.
   *
   * @param productId The ID of the product.
   * @param imageId The ID of the image to be deleted.
   * @returns The updated product after the image has been removed.
   */
  async deleteProductImage(
    productId: string,
    imageId: string,
  ): Promise<Product> {
    const endpoint = `/dashboard/storage/products/${productId}/images/${imageId}`;
    return apiClient.delete<Product>(endpoint);
  }
}

export const imageUploadService = new ImageUploadService();