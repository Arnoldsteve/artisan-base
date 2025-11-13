import { Injectable, Scope, Logger, Inject } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';
import { GetProductsDto } from './dto/get-products.dto';
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
      limit = 50,
      sortBy = 'name',
      sortOrder = 'asc',
      cursor,
    } = filters;

    const limitNum = Math.max(Number(limit) || 50, 1);

    // ✅ Generate a cache key including tenantId and filters
    const cacheKey = `${tenantId}:products:${JSON.stringify(filters)}`;

    // 1️⃣ Check Redis cache
    const cached = await this.redis.get<{
      data: any[];
      meta: { limit: number; nextCursor: string | null; hasMore: boolean };
    }>(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return cached; // no JSON.parse needed
    }

    // 2️⃣ Build where filter
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

    // 3️⃣ Set orderBy
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

    // 4️⃣ Query DB using cursor pagination
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

    // 5️⃣ Cache result for 2 minutes
    const result = {
      data: productsWithCategories,
      meta: { limit: limitNum, nextCursor, hasMore: !!nextCursor },
    };

    await this.redis.set(cacheKey, result, { ex: 300  }); // ✅ Store object directly

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

  async findFeatured() {
    const prisma = await this.getPrisma();
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 100,
      orderBy: {
        createdAt: 'desc',
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
    return products.map((product) => ({
      ...product,
      categories: product.categories.map((c) => c.category),
    }));
  }

  async findCategories() {
    const prisma = await this.getPrisma();
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            product: {
              isActive: true,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
    return categories;
  }
}
