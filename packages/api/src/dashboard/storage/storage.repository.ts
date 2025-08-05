import { Injectable, Logger, NotFoundException, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { TenantContextService } from 'src/common/tenant-context.service';
import { PrismaClient, Product } from '../../../generated/tenant';
import { IStorageRepository } from './interfaces/storage-repository.interface';
import { createId } from '@paralleldrive/cuid2';

const PRODUCT_IMAGES_BUCKET = 'product-images';
const SIGNED_URL_EXPIRES_IN = 60 * 5; // URL is valid for 5 minutes

interface ProductImage {
  id: string;
  url: string;
  path: string;
}

@Injectable({ scope: Scope.REQUEST })
export class StorageRepository implements IStorageRepository {
  private readonly logger = new Logger(StorageRepository.name);
  private prismaClient: PrismaClient | null = null;

  constructor(
    private readonly tenantPrismaService: TenantPrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async createSignedUploadUrl(
    productId: string,
    fileName: string,
    fileType: string,
  ) {
    const storage = this.supabaseService.getStorageClient();
    const tenantId = this.tenantContext.tenantId;

    const fileId = createId();
    const fileExtension = fileName.split('.').pop() || 'tmp';
    const path = `${tenantId}/${productId}/${fileId}.${fileExtension}`;

    const { data, error } = await storage
      .from(PRODUCT_IMAGES_BUCKET)
      .createSignedUploadUrl(path, SIGNED_URL_EXPIRES_IN as any);
    if (error) {
      this.logger.error('Could not create signed upload URL', error);
      throw new Error('Failed to create signed upload URL.');
    }

    return { ...data, path, fileId };
  }

  async finalizeUpload(productId: string, fileId: string, path: string): Promise<Product> {
    const prisma = await this.getPrisma();
    const storage = this.supabaseService.getStorageClient();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const { data: { publicUrl } } = storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);

    const newImage = { id: fileId, url: publicUrl, path };
    const existingImages = (product.images as any[]) || [];
    const newImageList = [...existingImages, newImage];

    return prisma.product.update({
      where: { id: productId },
      data: { images: newImageList },
    });
  }

  async deleteImage(productId: string, imageId: string): Promise<Product> {
    const prisma = await this.getPrisma();
    const storage = this.supabaseService.getStorageClient();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const images = (product.images as any[]) || [];
    const imageToDelete = images.find((img) => img.id === imageId);

    if (!imageToDelete || !imageToDelete.path) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found on this product or is invalid.`,
      );
    }

    const { error } = await storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([imageToDelete.path]);

    if (error) {
      this.logger.warn(
        `Could not delete file from storage, but removing from DB anyway: ${imageToDelete.path}`,
        error.message,
      );
    }

    const updatedImages = images.filter((img) => img.id !== imageId);

    return prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages },
    });
  }

  // Legacy direct upload method (if still needed)
  async uploadImages(
    productId: string,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const prisma = await this.getPrisma();
    const storage = this.supabaseService.getStorageClient();
    const tenantId = this.tenantContext.tenantId;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const uploadPromises = files.map(async (file) => {
      const fileId = createId();
      const fileExtension = file.originalname.split('.').pop() || 'jpg';
      const filePath = `${tenantId}/${productId}/${fileId}.${fileExtension}`;

      const { error } = await storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        this.logger.error(`Supabase upload failed for ${filePath}`, error);
        throw new Error(`Upload failed for file: ${file.originalname}`);
      }

      const { data: { publicUrl } } = storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);
      return { id: fileId, url: publicUrl, path: filePath };
    });

    const uploadedImages = await Promise.all(uploadPromises);
    
    const existingImages = (product.images as any[]) || [];
    const newImageList = [...existingImages, ...uploadedImages];
    
    return prisma.product.update({
      where: { id: productId },
      data: { images: newImageList },
    });
  }
}