import { Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontCategoryRepository } from './interfaces/storefront-category-repository.interface';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { PrismaClient } from '../../../generated/tenant';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontCategoryRepository
  implements IStorefrontCategoryRepository
{
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

  /**
   * EFFICIENTLY finds all categories with a TRUE count of their active products.
   */
  async findAll(filters: GetCategoriesDto) {
    const { search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prisma = await this.getPrisma();
    // Use a transaction for consistency
    const [categories, total] = await prisma.$transaction([
      // Query 1: Get the categories for the current page
      prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        // EFFICIENTLY count related active products directly in the database
        include: {
          _count: {
            select: {
              products: {
                where: {
                  product: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      }),
      // Query 2: Get the total count of categories matching the filter
      prisma.category.count({ where }),
    ]);

    // Prisma already did the counting. No manual mapping is needed.
    // The `categories` object now has a `_count: { products: number }` property.

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * CORRECTLY finds a single category, its newest 20 active products,
   * AND the TRUE total count of all its active products.
   */
  async findOne(id: string) {
    const prisma = await this.getPrisma();
    // We need two pieces of info: the paginated products and the total count.
    // A transaction runs both queries at the same time for max efficiency.
    const [category, activeProductCount] = await prisma.$transaction([
      // Query 1: Get the category and its 20 newest products
      prisma.category.findFirst({
        where: { id },
        include: {
          products: {
            include: {
              product: true,
            },
            orderBy: { product: { createdAt: 'desc' } },
            take: 20,
          },
        },
      }),
      // Query 2: Get the TRUE total count of ALL active products in this category
      prisma.product.count({
        where: {
          isActive: true,
          categories: { some: { categoryId: id } },
        },
      }),
    ]);

    if (!category) {
      return null;
    }

    // Flatten and filter the list of 20 products for display
    const paginatedActiveProducts = category.products
      .map((p) => p.product)
      .filter((prod) => prod && prod.isActive);

    // Return a complete object with the data you need
    return {
      ...category,
      products: paginatedActiveProducts,
      _count: {
        products: activeProductCount, // The true total count
      },
    };
  }
}