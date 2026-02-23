import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Category } from '@generated/prisma/client';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';
import { PageDto } from '@/common/pagination/dtos/page.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category> {
    return this.prisma.client.category.create({ data });
  }

  async findBySlug(slug: string, tenantId: string): Promise<Category | null> {
    return this.prisma.client.category.findFirst({
      where: {
        slug,
        tenantId,
      },
    });
  }

  /**
   * Resolve category by slug.
   * millions of users: Leverages the Prisma Extension to automatically 
   * filter by tenantId (Storefront mode) or return global (Marketplace mode).
   */
  async findBySlugIsolated(slug: string): Promise<Category | null> {
    return this.prisma.client.category.findFirst({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }
  
  async findById(id: string, tenantId: string): Promise<Category | null> {
    return this.prisma.client.category.findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  async list(options: PageOptionsDto): Promise<PageDto<Category>> {
    const where: Prisma.CategoryWhereInput = {
      ...(options.search && {
        name: { contains: options.search, mode: 'insensitive' },
      }),
    };

    return this.prisma.client.category.paginate({
      options,
      where,
      cache: true,
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
