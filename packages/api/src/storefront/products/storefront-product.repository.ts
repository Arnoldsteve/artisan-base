import { Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductRepository
  implements IStorefrontProductRepository
{
  constructor(private readonly prisma: TenantPrismaService) {}

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
