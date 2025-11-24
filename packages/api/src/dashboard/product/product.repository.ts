import { ConflictException, Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { IProductRepository } from './interfaces/product-repository.interface';
import { PrismaClient } from '../../../generated/tenant';
import slugify from 'slugify';

const CACHE_TTL = 10 * 1000;

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository implements IProductRepository {
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

  async create(dto: CreateProductDto) {
    try {
      const prisma = await this.getPrisma();

      let baseSlug = slugify(dto.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const existingSku = await prisma.product.findUnique({
        where: { sku: dto.sku },
      });

      if (existingSku) {
        throw new ConflictException('SKU already exists');
      }

      const product = await prisma.product.create({
        data: { ...dto, slug },
      });

      this.invalidateCache();
      return product;
    } catch (err) {
      if (err.code === 'P2002') {
        if (err.meta?.target?.includes('slug')) {
          throw new ConflictException('Slug already exists');
        }
        if (err.meta?.target?.includes('sku')) {
          throw new ConflictException('SKU already exists');
        }
      }
      throw err;
    }
  }

  async findAll(pagination: PaginationQueryDto) {
    const { page, limit = 50, search } = pagination;

    const prisma = await this.getPrisma();

    const where =
      search && search.trim().length > 0
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

    const result = await paginate(
      prisma.product,
      { page, limit },
      {
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: {
            include: { category: true },
          },
        },
      },
    );

    return result;
  }

  async findOne(id: string) {
    const now = Date.now();
    const cached = this.findOneCache.get(id);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const prisma = await this.getPrisma();
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    if (product) {
      this.findOneCache.set(id, { data: product, expires: now + CACHE_TTL });
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const prisma = await this.getPrisma();

    let dataToUpdate: any = { ...dto };

    // If name is being updated → regenerate slug
    if (dto.name) {
      let baseSlug = slugify(dto.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness
      while (
        await prisma.product.findFirst({
          where: { slug, NOT: { id } }, // exclude current product
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      dataToUpdate.slug = slug;
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    this.invalidateCache(id);
    return product;
  }

  async remove(id: string) {
    const prisma = await this.getPrisma();
    const product = await prisma.product.delete({ where: { id } });
    this.invalidateCache(id);
    return product;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }

  async assignCategories(productId: string, categoryIds: string[]) {
    const prisma = await this.getPrisma();

    // Remove existing categories
    await prisma.productCategory.deleteMany({
      where: { productId },
    });

    // Add new categories
    if (categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          productId,
          categoryId,
        })),
      });
    }

    this.invalidateCache(productId);
    return this.findOne(productId);
  }
}
