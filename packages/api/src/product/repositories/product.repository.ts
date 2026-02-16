import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Product } from '@generated/prisma/client';

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

  async list(params: { skip?: number; take?: number; where?: Prisma.ProductWhereInput }) {
    return this.prisma.client.product.findMany({
      ...params,
      include: {
        categories: { include: { category: true } }
      },
      orderBy: { createdAt: 'desc' },
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