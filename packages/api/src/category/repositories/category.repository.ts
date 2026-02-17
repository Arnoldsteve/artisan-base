import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Category } from '@generated/prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.CategoryUncheckedCreateInput,
  ): Promise<Category> {
    return this.prisma.client.category.create({ data });
  }

  async findBySlug(
    slug: string,
    tenantId: string,
  ): Promise<Category | null> {
    return this.prisma.client.category.findFirst({
      where: {
        slug,
        tenantId,
      },
    });
  }

  async findById(
    id: string,
    tenantId: string,
  ): Promise<Category | null> {
    return this.prisma.client.category.findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  async list(params: {
    tenantId: string;
    skip?: number;
    take?: number;
  }): Promise<Category[]> {
    const { tenantId, skip = 0, take = 10 } = params;

    return this.prisma.client.category.findMany({
      where: {
        tenantId,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async count(where?: Prisma.CategoryWhereInput): Promise<number> {
    return this.prisma.client.category.count({ where });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.prisma.client.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.client.category.delete({
      where: { id },
    });
  }
}
