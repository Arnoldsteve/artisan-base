import { Injectable, Scope, Logger } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';
import { GetProductsDto } from './dto/get-products.dto';
import { PrismaClient, Prisma  } from '../../../generated/tenant';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductRepository
  implements IStorefrontProductRepository
{
  private readonly logger = new Logger(StorefrontProductRepository.name);

  // This will hold the client once it's initialized
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * Lazy getter that initializes the Prisma client only when first needed
   * and reuses it for subsequent calls within the same request
   */
  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async findAll(filters: GetProductsDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 100,
      sortBy = 'name',
      sortOrder = 'asc',
    } = filters;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 100, 1);
    const skip = (pageNum - 1) * limitNum;

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
          category: {
            name: { equals: category, mode: 'insensitive' },
          },
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

    let orderBy: any = {};
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'created':
        orderBy = { createdAt: sortOrder === 'desc' ? 'desc' : 'asc' };
        break;
      default:
        orderBy = { name: sortOrder === 'desc' ? 'desc' : 'asc' };
    }

    const prisma = await this.getPrisma();

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
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
              category: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithCategories = products.map((p) => ({
      ...p,
      categories: p.categories.map((c) => c.category),
    }));

    return {
      data: productsWithCategories,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
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
