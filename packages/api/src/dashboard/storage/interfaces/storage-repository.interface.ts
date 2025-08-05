import { Product } from "generated/tenant";

// storage-repository.interface.ts
export interface IStorageRepository {
  uploadImages(productId: string, files: Express.Multer.File[]): Promise<Product>;
  deleteImage(productId: string, imageId: string): Promise<Product>;
}