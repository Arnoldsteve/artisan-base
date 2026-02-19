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
   * This implementation now leverages the full Cache + Pagination + Isolation pipeline.
   */
  async list(options: PageOptionsDto): Promise<PageDto<Product>> {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(options.search && {
        name: { contains: options.search, mode: 'insensitive' },
      }),
    };

    // ONE CALL: Security + Pagination + Cache + Metadata
    return this.prisma.client.product.paginate({
      options,
      where,
      include: { categories: { include: { category: true } } },
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
