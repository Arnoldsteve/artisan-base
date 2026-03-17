import { apiClient } from "@/lib/client-api";
import { Product } from "@/types/products";
import {
  SignedUploadUrlResponse,
  FinalizeUploadPayload,
} from "@/types/image-upload";

/**
 * SOLID Principle: Single Responsibility
 * This service handles the specialized multi-step lifecycle of product images.
 */
export class ImageUploadService {
  /**
   * STEP 1: Request a signed URL from the backend.
   */
  async createSignedUploadUrl(
    productId: string,
    fileName: string,
    fileType: string
  ): Promise<SignedUploadUrlResponse> {
    return apiClient.post<SignedUploadUrlResponse>(
      `/products/${productId}/images/signed-url`,
      { fileName, fileType }
    );
  }

  /**
   * STEP 2: Binary Upload (Direct to Provider).
   * ⚡ FIX: Added this missing method.
   * millions of users: Bypassing the backend saves bandwidth and prevents timeouts.
   */
  async uploadBinary(signedUrl: string, file: File): Promise<void> {
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!response.ok) {
      throw new Error(`Cloud storage rejected the upload for ${file.name}`);
    }
  }

  /**
   * STEP 3: Finalize the upload.
   * ⚡ FIX: Refactored to accept the 'FinalizeUploadPayload' object 
   * instead of 3 positional arguments. This makes the code cleaner and 
   * resolves the "Expected 3 arguments" error in your hook.
   */
  async finalizeUpload(payload: FinalizeUploadPayload): Promise<Product> {
    const { productId, fileId, path } = payload;
    
    return apiClient.post<Product>(
      `/products/${productId}/images/finalize`,
      { fileId, path }
    );
  }

  /**
   * ACTION: Removes an image from a product.
   */
  async deleteProductImage(productId: string, imageId: string): Promise<Product> {
    return apiClient.delete<Product>(
      `/products/${productId}/images/${imageId}`
    );
  }
}

export const imageUploadService = new ImageUploadService();