import {
  Injectable,
  ConflictException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { ICategoryRepository } from './interfaces/category-repository.interface';
import slugify from 'slugify';
import { PrismaClient } from '../../../generated/tenant';

const CACHE_TTL = 10 * 1000; 

@Injectable({ scope: Scope.REQUEST })
export class CategoryRepository implements ICategoryRepository {
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;


  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async create(dto: CreateCategoryDto): Promise<any> {
    const prisma = await this.getPrisma();
    const slug = slugify(dto.name, { lower: true, strict: true });
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(
        `A category with the name '${dto.name}' already exists.`,
      );
    }
    const category = await prisma.category.create({
      data: { ...dto, slug },
    });
    return category;
  }

  async findAll(paginationQuery?: PaginationQueryDto): Promise<any> {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }

    const prisma = await this.getPrisma();
    const result = await paginate(
      prisma.category,
      {
      page: paginationQuery?.page,
      limit: paginationQuery?.limit,
      },
      {
        orderBy: { createdAt: 'desc' },
          include: { 
            _count: { 
              select: { products: true
            }, 
          }, 
        } 
      }
    )
    this.findAllCache = { data: result, expires: now + CACHE_TTL };
    return result;
  }

  async findOne(id: string): Promise<any> {
    const prisma = await this.getPrisma();
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<any> {
    await this.findOne(id); // This will call getPrisma internally
    const prisma = await this.getPrisma();
    const data: any = { ...dto };
    if (dto.name) {
      data.slug = slugify(dto.name, { lower: true, strict: true });
      const existing = await prisma.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(
          `A category with the name '${dto.name}' already exists.`,
        );
      }
    }
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return category;
  }

  async remove(id: string): Promise<any> {
    await this.findOne(id); // This will call getPrisma internally
    const prisma = await this.getPrisma();
    const category = await prisma.category.delete({ where: { id } });
    return category;
  }
}