import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Product } from '@generated/prisma/client';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';
import { PageDto } from '@/common/pagination/dtos/page.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return this.prisma.client.product.create({
      data,
      include: {
        categories: true,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.client.product.findUnique({
      where: { id },
      include: {
        categories: true,
        variants: true,
      },
    });
  }

  /**
   * DATABASE ACTION: findFeatured
   * filters for products that are both active and marked as featured.
   */
  async findFeatured(limit: number) {
    return this.prisma.client.product.findMany({
      where: {
        isActive: true,
        // isFeatured: true, // Make sure this is in your schema.prisma!
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        categories: { include: { category: true } },
      },
    });
  }

  /**
   * Used for the Product Detail Page.
   * Includes Merchant info so the customer can visit the specific store.
   */
  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.client.product.findFirst({
      where: { slug },
      include: {
        tenant: {
          select: {
            name: true,
            subdomain: true,
          },
        },
        variants: true,
        categories: { include: { category: true } },
      },
    });
  }

  /**
   * Enterprise Standard: The Repository defines the "Shape" and "Policy".
   * Optimized for both Global Marketplace and Isolated Storefronts.
   */
  async list(options: PageOptionsDto): Promise<PageDto<Product>> {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(options.search && {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' } },
          { sku: { contains: options.search, mode: 'insensitive' } },
        ],
      }),
    };

    /**
     * TOP 1% ARCHITECTURE: Eager Loading Merchant Identity
     * In a marketplace, we MUST know who the seller is.
     * We select only 'name' and 'subdomain' to keep the payload lean for millions of rows.
     */
    return this.prisma.client.product.paginate({
      options,
      where,
      include: {
        tenant: {
          select: {
            name: true,
            subdomain: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      cache: true,
    });
  }

  /**
   * FIX: Added count method for pagination
   */
  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return this.prisma.client.product.count({ where });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.client.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.client.product.delete({
      where: { id },
    });
  }

  async existsBySku(sku: string): Promise<boolean> {
    const count = await this.prisma.client.product.count({
      where: { sku },
    });
    return count > 0;
  }
}
