import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { IProductRepository } from './interfaces/product-repository.interface';
import { PrismaClient } from '../../../generated/tenant'; // Import the actual PrismaClient type

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

// Make the repository request-scoped to ensure cache is not shared across requests/tenants
@Injectable({ scope: Scope.REQUEST })
export class ProductRepository implements IProductRepository, OnModuleInit {
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;

  // This property will hold the ready-to-use client for this request.
  private prisma: PrismaClient;

  // Inject our standard gateway to the prisma client factory
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * This hook runs once per request, fetching the correct Prisma client for the
   * tenant and assigning it to the local `this.prisma` property.
   */
  async onModuleInit() {
    this.prisma = await this.tenantPrismaService.getClient();
  }

  // --- ALL LOGIC BELOW REMAINS UNCHANGED ---
  // It will now use the `this.prisma` property that was correctly initialized.

  async create(dto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({ data: dto });
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
      this.prisma.product,
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
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      this.findOneCache.set(id, { data: product, expires: now + CACHE_TTL });
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
    });
    this.invalidateCache(id);
    return product;
  }

  async remove(id: string) {
    const product = await this.prisma.product.delete({ where: { id } });
    this.invalidateCache(id);
    return product;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}