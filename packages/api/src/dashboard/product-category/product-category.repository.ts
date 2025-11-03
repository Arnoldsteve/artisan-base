import {
  Injectable,
  ConflictException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { PrismaClient } from '../../../generated/tenant';
import { paginate } from '@/common/helpers/paginate.helper';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductCategoryRepository {
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async assignProductToCategory(productId: string, categoryId: string) {
    const prisma = await this.getPrisma();
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

  async getProductsForCategory(
    categoryId: string,
    paginationQuery: PaginationQueryDto,
  ) {
    const prisma = await this.getPrisma();
    const { page, limit, search } = paginationQuery;

    const where: any = {
      categoryId,
      ...(search && search.trim().length > 0
        ? {
            product: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const result = await paginate(
      prisma.productCategory,
      { page, limit },
      {
        where,
        include: {
          product: {
            include: {
              categories: {
                include: { category: true },
              },
            },
          },
          category: true,
        },
        orderBy: {
          product: {
            createdAt: 'desc',
          },
        },
      },
    );

    return result;
  }
}
