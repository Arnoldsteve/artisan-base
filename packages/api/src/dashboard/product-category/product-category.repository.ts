import {
  Injectable,
  ConflictException,
  NotFoundException,
  Scope,
  OnModuleInit,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { PrismaClient } from '../../../generated/tenant'; // Import the actual PrismaClient type

// Make the repository request-scoped to ensure it uses the correct tenant client
@Injectable({ scope: Scope.REQUEST })
export class ProductCategoryRepository implements OnModuleInit {
  // This property will hold the ready-to-use client for this request.
  private prisma: PrismaClient;

  // Inject our standard gateway to the prisma client factory
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * This hook runs once per request, fetching the correct Prisma client for the
   * tenant and assigning it to the local `this.prisma` property.
   */
  async onModuleInit() {
    this.prisma = await this.tenantPrismaService.getClient();
  }

  // --- ALL LOGIC BELOW REMAINS UNCHANGED ---
  // It will now use the `this.prisma` property that was correctly initialized.

  async assignProductToCategory(productId: string, categoryId: string) {
    // Check if assignment already exists
    const existing = await this.prisma.productCategory.findUnique({
      where: { productId_categoryId: { productId, categoryId } },
    });
    if (existing) {
      throw new ConflictException(
        'Product is already assigned to this category.',
      );
    }
    return this.prisma.productCategory.create({
      data: { productId, categoryId },
    });
  }

  async unassignProductFromCategory(productId: string, categoryId: string) {
    // Check if assignment exists
    const existing = await this.prisma.productCategory.findUnique({
      where: { productId_categoryId: { productId, categoryId } },
    });
    if (!existing) {
      throw new NotFoundException('Assignment does not exist.');
    }
    return this.prisma.productCategory.delete({
      where: { productId_categoryId: { productId, categoryId } },
    });
  }

  async getCategoriesForProduct(productId: string) {
    return this.prisma.productCategory.findMany({
      where: { productId },
      include: { category: true },
    });
  }

  async getProductsForCategory(categoryId: string) {
    return this.prisma.productCategory.findMany({
      where: { categoryId },
      include: { product: true },
    });
  }
}