import { Injectable, Scope } from '@nestjs/common';
import { StorageRepository } from './storage.repository';

@Injectable({ scope: Scope.REQUEST })
export class StorageService {
  constructor(private readonly storageRepository: StorageRepository) {}

  createSignedUploadUrl(
    productId: string,
    fileName: string,
    fileType: string,
  ) {
    return this.storageRepository.createSignedUploadUrl(
      productId,
      fileName,
      fileType,
    );
  }

  finalizeUpload(productId: string, fileId: string, path: string) {
    return this.storageRepository.finalizeUpload(productId, fileId, path);
  }

  deleteImage(productId: string, imageId: string) {
    return this.storageRepository.deleteImage(productId, imageId);
  }
}