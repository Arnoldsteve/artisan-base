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

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;

  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(dto: CreateCategoryDto) {
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
    this.invalidateCache();
    return category;
  }

  async findAll(pagination?: PaginationQueryDto) {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }
    const categories = await this.tenantPrisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    this.findAllCache = { data: categories, expires: now + CACHE_TTL };
    return categories;
  }

  async findOne(id: string) {
    const now = Date.now();
    const cached = this.findOneCache.get(id);
    if (cached && cached.expires > now) {
      return cached.data;
    }
    const category = await this.tenantPrisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    this.findOneCache.set(id, { data: category, expires: now + CACHE_TTL });
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
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
    this.invalidateCache(id);
    return category;
  }

  async remove(id: string) {
    await this.findOne(id);
    const category = await this.tenantPrisma.category.delete({ where: { id } });
    this.invalidateCache(id);
    return category;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}
