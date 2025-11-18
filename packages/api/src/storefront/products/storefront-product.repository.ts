import { Injectable, Scope, Logger, Inject } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';
import { GetProductsDto } from './dto/get-products.dto';
import { GetFeaturedProductsDto } from './dto/get-featured-products';
import { PrismaClient, Prisma } from '../../../generated/tenant';
import { Redis } from '@upstash/redis';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductRepository
  implements IStorefrontProductRepository
{
  private readonly logger = new Logger(StorefrontProductRepository.name);

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

  async findAll(filters: GetProductsDto, tenantId: string) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      limit,
      sortBy = 'name',
      sortOrder = 'asc',
      cursor,
    } = filters;

    const limitNum = Math.max(Number(limit) || 50, 1);

    const cacheKey = `${tenantId}:products:${JSON.stringify(filters)}`;

    const cached = await this.redis.get<{
      data: any[];
      meta: { limit: number; nextCursor: string | null; hasMore: boolean };
    }>(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          category: { name: { equals: category, mode: 'insensitive' } },
        },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice)))
        where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice !== undefined && !isNaN(Number(maxPrice)))
        where.price.lte = new Prisma.Decimal(maxPrice);
    }

    let orderBy: any = [];
    switch (sortBy) {
      case 'price-low':
        orderBy = [{ price: 'asc' }, { id: 'asc' }];
        break;
      case 'price-high':
        orderBy = [{ price: 'desc' }, { id: 'asc' }];
        break;
      case 'created':
        orderBy = [
          { createdAt: sortOrder === 'desc' ? 'desc' : 'asc' },
          { id: 'asc' },
        ];
        break;
      default:
        orderBy = [
          { name: sortOrder === 'desc' ? 'desc' : 'asc' },
          { id: 'asc' },
        ];
    }

    const prisma = await this.getPrisma();

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limitNum,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        sku: true,
        inventoryQuantity: true,
        isFeatured: true,
        isActive: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
        reviews: {
          where: { isApproved: true },
          select: { id: true, rating: true, comment: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const productsWithCategories = products.map((p) => ({
      ...p,
      categories: p.categories.map((c) => c.category),
    }));

    const nextCursor =
      productsWithCategories.length > 0
        ? productsWithCategories[productsWithCategories.length - 1].id
        : null;

    const result = {
      data: productsWithCategories,
      meta: { limit: limitNum, nextCursor, hasMore: !!nextCursor },
    };

    await this.redis.set(cacheKey, result, { ex: 300 });

    return result;
  }

  async findOne(identifier: string) {
    const prisma = await this.getPrisma();

    const product = await prisma.product.findFirst({
      where: {
        AND: [{ isActive: true }],
        OR: [{ id: identifier }, { slug: identifier }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        sku: true,
        inventoryQuantity: true,
        isFeatured: true,
        isActive: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!product) return null;
    return {
      ...product,
      categories: product.categories.map((c) => c.category),
    };
  }
  async findFeatured(filters: GetFeaturedProductsDto, tenantId: string) {
    const prisma = await this.getPrisma();
    const limit = filters.limit ?? 12;
    const cursor = filters.cursor ?? null;

    const cacheKey = `featured:${tenantId}:limit:${limit}:cursor:${cursor || 'start'}`;

    const cached = await this.redis.get<{
      data: any[];
      meta: { limit: number; nextCursor: string | null; hasMore: boolean };
    }>(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    // Query the database
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        isFeatured: true,
        isActive: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Determine nextCursor for pagination
    const nextCursor =
      products.length > 0 ? products[products.length - 1].id : null;

    const result = {
      data: products,
      meta: { limit, nextCursor, hasMore: !!nextCursor },
    };

    await this.redis.set(cacheKey, result, { ex: 300 });

    return result;
  }

  async findCategories(tenantId: string) {
    const cacheKey = `${tenantId}:categories`;

    const cached = await this.redis.get<{
      data: any[];
      meta: { total: number };
    }>(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit: ${cacheKey}`);
      return cached;
    }

    const prisma = await this.getPrisma();

    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            product: { isActive: true },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    const result = {
      data: categories,
      meta: { total: categories.length },
    };

    await this.redis.set(cacheKey, result, { ex: 30 }); //1200

    return result;
  }
}
