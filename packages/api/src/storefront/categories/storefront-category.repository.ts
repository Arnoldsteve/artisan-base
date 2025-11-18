import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontCategoryRepository } from './interfaces/storefront-category-repository.interface';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { PrismaClient } from '../../../generated/tenant';
import { Redis } from '@upstash/redis';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontCategoryRepository
  implements IStorefrontCategoryRepository
{
  private readonly logger = new Logger(StorefrontCategoryRepository.name);

  private prismaClient: PrismaClient | null = null;

  constructor(
    private readonly tenantPrismaService: TenantPrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async findAll(filters: GetCategoriesDto, tenantId: string) {
    const { search, limit, cursor } = filters;
    const take = Number(limit);

    const cacheKey = `${tenantId}:categories-list:${cursor || 'first'}:${take}:${search || ''}`;

    const cached = await this.redis.get<{
      data: any[];
      meta: { limit: number; nextCursor: string | null; hasMore: boolean };
    }>(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prisma = await this.getPrisma();

    // Fetch take + 1 to check if there are more
    const categories = await prisma.category.findMany({
      where,
      orderBy: { id: 'asc' },
      take: take + 1, 
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      include: {
        _count: {
          select: {
            products: {
              where: { product: { isActive: true } },
            },
          },
        },
      },
    });

    const hasMore = categories.length > take;

    const returnCategories = hasMore ? categories.slice(0, take) : categories;

    const nextCursor =
      hasMore && returnCategories.length > 0
        ? returnCategories[returnCategories.length - 1].id
        : null;

    const result = {
      data: returnCategories, 
      meta: {
        limit: take,
        nextCursor,
        hasMore, 
      },
    };

    await this.redis.set(cacheKey, result, { ex: 1200 });

    return result;
  }

  async findOne(identifier: string) {
    const prisma = await this.getPrisma();
    // We need two pieces of info: the paginated products and the total count.
    // A transaction runs both queries at the same time for max efficiency.
    const [category, activeProductCount] = await prisma.$transaction([
      // Query 1: Get the category and its 20 newest products
      prisma.category.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
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
          categories: {
            some: {
              category: {
                OR: [{ id: identifier }, { slug: identifier }],
              },
            },
          },
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
