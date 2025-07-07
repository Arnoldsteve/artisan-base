import { Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontCategoryRepository } from './interfaces/storefront-category-repository.interface';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontCategoryRepository
  implements IStorefrontCategoryRepository
{
  constructor(private readonly prisma: TenantPrismaService) {}

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

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    // Add _count.products for each category (only active products)
    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      _count: {
        products: cat.products.filter((p) => p.product && p.product.isActive)
          .length,
      },
    }));

    return {
      data: categoriesWithCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
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
    });
    if (!category) return null;
    // Flatten and filter products
    return {
      ...category,
      products: category.products
        .map((p) => p.product)
        .filter((prod) => prod && prod.isActive),
    };
  }
}
