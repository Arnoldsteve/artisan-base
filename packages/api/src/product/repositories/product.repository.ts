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
   * FIX: Changed to findFirst.
   * findUnique requires the compound key { tenantId_slug: { ... } }.
   * findFirst allows us to use just 'slug' because the extension adds the tenantId.
   */
  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.client.product.findFirst({
      where: { slug },
    });
  }

 /**
   * Enterprise Standard: The Repository defines the "Shape" and "Policy".
   * It combines business search logic with the pagination engine.
   */
  async list(options: PageOptionsDto): Promise<PageDto<Product>> {
    const where: Prisma.ProductWhereInput = {
      // Base Policy: Only show active products in the general list
      isActive: true,
      
      // Dynamic Search Logic
      ...(options.search && {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' } },
          { sku: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } },
        ],
      }),
    };

    // The "One-Line" Engine: isolation and pagination happen here
    return this.prisma.client.product.paginate({
      options,
      where,
      include: {
        categories: {
          include: { category: true },
        },
      },
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