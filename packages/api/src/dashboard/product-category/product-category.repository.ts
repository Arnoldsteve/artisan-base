import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IProductCategoryRepository } from './interfaces/product-category-repository.interface';

@Injectable()
export class ProductCategoryRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async assignProductToCategory(productId: string, categoryId: string) {
    // Check if assignment already exists
    const existing = await this.tenantPrisma.productCategory.findUnique({
      where: { productId_categoryId: { productId, categoryId } },
    });
    if (existing) {
      throw new ConflictException(
        'Product is already assigned to this category.',
      );
    }
    return this.tenantPrisma.productCategory.create({
      data: { productId, categoryId },
    });
  }

  async unassignProductFromCategory(productId: string, categoryId: string) {
    // Check if assignment exists
    const existing = await this.tenantPrisma.productCategory.findUnique({
      where: { productId_categoryId: { productId, categoryId } },
    });
    if (!existing) {
      throw new NotFoundException('Assignment does not exist.');
    }
    return this.tenantPrisma.productCategory.delete({
      where: { productId_categoryId: { productId, categoryId } },
    });
  }

  async getCategoriesForProduct(productId: string) {
    return this.tenantPrisma.productCategory.findMany({
      where: { productId },
      include: { category: true },
    });
  }

  async getProductsForCategory(categoryId: string) {
    return this.tenantPrisma.productCategory.findMany({
      where: { categoryId },
      include: { product: true },
    });
  }
}
