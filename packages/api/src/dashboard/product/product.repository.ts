import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  Scope,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { IProductRepository } from './interfaces/product-repository.interface';
import { PrismaClient } from '../../../generated/tenant';
import slugify from 'slugify';
import { Prisma } from '../../../generated/tenant';
import { randomBytes } from 'crypto';

const CACHE_TTL = 10 * 1000;

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository implements IProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
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
    const prisma = await this.getPrisma();
    const baseSlug = slugify(dto.name, { lower: true, strict: true });
    const sku = dto.sku?.trim() || undefined;

    const MAX_RETRIES = 5;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const slug =
          i === 0 ? baseSlug : `${baseSlug}-${randomBytes(3).toString('hex')}`;

        const product = await prisma.product.create({
          data: {
            ...dto,
            slug,
            sku,
          },
        });

        this.invalidateCache();
        return product;
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          const meta = err.meta as { target?: string[] };
          if (meta.target?.includes('sku')) {
            throw new ConflictException('SKU already exists');
          }

          if (meta.target?.includes('slug')) {
            this.logger.warn(
              `Slug collision for "${baseSlug}". Retrying... (Attempt ${i + 1})`,
            );
            continue;
          }
        }

        throw new InternalServerErrorException(
          'Could not generate a unique slug for the product.',
        );
      }
    }

    throw new InternalServerErrorException(
      'Could not generate a unique slug for the product.',
    );
  }

  async bulkCreate(dtos: CreateProductDto[]) {
    const prisma = await this.getPrisma();

    const slugsToTest: string[] = [];
    const skusToTest: string[] = [];
    const productsToCreate = dtos.map((dto) => {
      const slug = slugify(dto.name, { lower: true, strict: true });
      slugsToTest.push(slug);
      if (dto.sku) {
        skusToTest.push(dto.sku);
      }
      return { ...dto, slug, sku: dto.sku?.trim() || undefined };
    });

    if (skusToTest.length > 0) {
      const existingSkus = await prisma.product.findMany({
        where: { sku: { in: skusToTest } },
        select: { sku: true },
      });
      if (existingSkus.length > 0) {
        throw new ConflictException(
          `The following SKUs already exist: ${existingSkus.map((p) => p.sku).join(', ')}`,
        );
      }
    }

    const existingSlugs = new Set(
      (
        await prisma.product.findMany({
          where: { slug: { in: slugsToTest } },
          select: { slug: true },
        })
      ).map((p) => p.slug),
    );

    const batchSlugs = new Set<string>();

    for (const product of productsToCreate) {
      let finalSlug = product.slug;
      let counter = 1;
      // Check if slug exists in DB or in the current batch we are building
      while (existingSlugs.has(finalSlug) || batchSlugs.has(finalSlug)) {
        finalSlug = `${product.slug}-${counter}`;
        counter++;
      }
      product.slug = finalSlug;
      batchSlugs.add(finalSlug);
    }

    try {
      const result = await prisma.product.createMany({
        data: productsToCreate,
      });

      this.invalidateCache();
      return { count: result.count };
    } catch (err) {
      // This can still fail if there's a race condition, but it's much less likely.
      this.logger.error('Bulk create failed', err);
      throw new InternalServerErrorException(
        'Failed to create products in bulk.',
      );
    }
  }

  async findAll(pagination: PaginationQueryDto) {
    const { page, limit, search } = pagination;

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
