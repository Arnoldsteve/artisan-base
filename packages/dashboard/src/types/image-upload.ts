import { Product } from "./products";

/**
 * 1. Response returned from the backend when requesting 
 * permission to upload to storage.
 */
export interface SignedUploadUrlResponse {
  signedUrl: string; // The temporary URL for binary upload (PUT)
  path: string;      // The storage path (bucket path)
  fileId: string;    // The database ID created for this image record
}

/**
 * 2. Input required to request a signed URL.
 */
export interface CreateSignedUploadUrlPayload {
  productId: string;
  fileName: string;
  fileType: string;
}

/**
 * 3. Input required to notify the backend that the 
 * binary file is successfully in storage.
 */
export interface FinalizeUploadPayload {
  productId: string;
  fileId: string;
  path: string;
}

/**
 * 4. Input required to remove an image.
 */
export interface DeleteProductImagePayload {
  productId: string;
  imageId: string;
}

/**
 * 5. Variables used by the React Query Mutation hook
 * to handle multiple images.
 */
export interface UploadProductImagesVariables {
  productId: string;
  images: File[];
}

/**
 * 6. Optional: Helper to track local upload status
 */
export interface ImageUploadState {
  isUploading: boolean;
  error?: string | null;
}