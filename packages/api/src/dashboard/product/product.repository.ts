import { Injectable, Logger } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { IProductRepository } from './interfaces/product-repository.interface';

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable()
export class ProductRepository implements IProductRepository {
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;

  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(dto: CreateProductDto) {
    try {
      const product = await this.tenantPrisma.product.create({ data: dto });
      this.invalidateCache();
      return product;
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('slug')) {
        throw new Error('Slug already exists');
      }
      throw err;
    }
  }

  async findAll(pagination: PaginationQueryDto) {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }
    const result = await paginate(
      this.tenantPrisma.product,
      {
        page: pagination.page,
        limit: pagination.limit,
      },
      {
        orderBy: { createdAt: 'desc' },
      },
    );
    this.findAllCache = { data: result, expires: now + CACHE_TTL };
    return result;
  }

  async findOne(id: string) {
    const now = Date.now();
    const cached = this.findOneCache.get(id);
    if (cached && cached.expires > now) {
      return cached.data;
    }
    const product = await this.tenantPrisma.product.findUnique({
      where: { id },
    });
    if (product) {
      this.findOneCache.set(id, { data: product, expires: now + CACHE_TTL });
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.tenantPrisma.product.update({
      where: { id },
      data: dto,
    });
    this.invalidateCache(id);
    return product;
  }

  async remove(id: string) {
    const product = await this.tenantPrisma.product.delete({ where: { id } });
    this.invalidateCache(id);
    return product;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}
