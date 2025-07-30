import { Injectable, Scope, OnModuleInit, Logger } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';
import { GetProductsDto } from './dto/get-products.dto';
import { PrismaClient } from '../../../generated/tenant'; // Import the actual PrismaClient type

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductRepository
  implements IStorefrontProductRepository, OnModuleInit // Implement OnModuleInit
{
    private readonly logger = new Logger(StorefrontProductRepository.name); // <-- Add this

  // This property will hold the ready-to-use client for this specific request.
  private prisma: PrismaClient;

  // Inject our new service, which acts as a gateway to the central client factory.
  constructor(private readonly tenantPrismaService: TenantPrismaService) {
        this.logger.log('StorefrontProductRepository INSTANCE CREATED.'); 

  }
  

  /**
   * This NestJS lifecycle hook runs once per request when this repository is created.
   * It asynchronously fetches the correct, long-lived Prisma client for the current tenant
   * from our factory and assigns it to the local `this.prisma` property for use in this class.
   */
  async onModuleInit() {
    this.prisma = await this.tenantPrismaService.getClient();
  }

  // --- ALL LOGIC BELOW REMAINS UNCHANGED ---
  // It will now use the `this.prisma` property that was correctly initialized above.

  async findAll(filters: GetProductsDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true, // Only show active products in storefront
    };

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
            name: category,
          },
        },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'price-low':
        orderBy.price = 'asc';
        break;
      case 'price-high':
        orderBy.price = 'desc';
        break;
      case 'created':
        orderBy.createdAt = sortOrder;
        break;
      default:
        orderBy.name = sortOrder;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      }),
      this.prisma.product.count({ where }),
    ]);

    // Flatten categories for each product
    const productsWithCategories = products.map((product) => ({
      ...product,
      categories: product.categories.map((c) => c.category),
    }));

    return {
      data: productsWithCategories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        isActive: true,
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
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 8,
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
    // Get all categories that have at least one active product
    const categories = await this.prisma.category.findMany({
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
      },
    });
    return categories;
  }
}