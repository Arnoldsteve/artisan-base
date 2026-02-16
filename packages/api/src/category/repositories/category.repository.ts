import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Category } from '@generated/prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category> {
    return this.prisma.client.category.create({ data });
  }

  async list() {
    return this.prisma.client.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}