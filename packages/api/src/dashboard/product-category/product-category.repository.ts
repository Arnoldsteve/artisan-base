import {
  Injectable,
  ConflictException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { PrismaClient } from '../../../generated/tenant';

@Injectable({ scope: Scope.REQUEST })
export class ProductCategoryRepository {
  // This will hold the client once it's initialized for the request
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * Lazy getter that initializes the Prisma client only when first needed
   * and reuses it for subsequent calls within the same request.
   */
  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async assignProductToCategory(productId: string, categoryId: string) {
    const prisma = await this.getPrisma();
    // Check if assignment already exists
    const existing = await prisma.productCategory.findUnique({
      where: { productId_categoryId: { productId, categoryId } },
    });
    if (existing) {
      throw new ConflictException(
        'Product is already assigned to this category.',
      );
    }
    return prisma.productCategory.create({
      data: { productId, categoryId },
    });
  }

  async unassignProductFromCategory(productId: string, categoryId: string) {
    const prisma = await this.getPrisma();
    // Check if assignment exists
    const existing = await prisma.productCategory.findUnique({
      where: { productId_categoryId: { productId, categoryId } },
    });
    if (!existing) {
      throw new NotFoundException('Assignment does not exist.');
    }
    return prisma.productCategory.delete({
      where: { productId_categoryId: { productId, categoryId } },
    });
  }

  async getCategoriesForProduct(productId: string) {
    const prisma = await this.getPrisma();
    return prisma.productCategory.findMany({
      where: { productId },
      include: { category: true },
    });
  }

  async getProductsForCategory(categoryId: string) {
    const prisma = await this.getPrisma();
    return prisma.productCategory.findMany({
      where: { categoryId },
      include: { product: true },
    });
  }
}