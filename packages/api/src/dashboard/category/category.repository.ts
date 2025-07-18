import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ICategoryRepository } from './interfaces/category-repository.interface';
import slugify from 'slugify';
import { ICacheService } from './interfaces/cache-service.interface';
import { InMemoryCacheService } from './services/in-memory-cache.service';

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(dto: CreateCategoryDto): Promise<any> {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const existing = await this.tenantPrisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(
        `A category with the name '${dto.name}' already exists.`,
      );
    }
    const category = await this.tenantPrisma.category.create({
      data: { ...dto, slug },
    });
    return category;
  }

  async findAll(pagination?: PaginationQueryDto): Promise<any> {
    return this.tenantPrisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<any> {
    const category = await this.tenantPrisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<any> {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.name) {
      data.slug = slugify(dto.name, { lower: true, strict: true });
      const existing = await this.tenantPrisma.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(
          `A category with the name '${dto.name}' already exists.`,
        );
      }
    }
    const category = await this.tenantPrisma.category.update({
      where: { id },
      data,
    });
    return category;
  }

  async remove(id: string): Promise<any> {
    await this.findOne(id);
    const category = await this.tenantPrisma.category.delete({ where: { id } });
    return category;
  }
}
