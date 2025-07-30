import { Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { ICustomerRepository } from './interfaces/customer-repository.interface';
import { PrismaClient } from '../../../generated/tenant';

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable({ scope: Scope.REQUEST })
export class CustomerRepository implements ICustomerRepository {
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;

  // This will hold the client once it's initialized for the request
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * Lazy getter that initializes the Prisma client only when first needed
   * and reuses it for subsequent calls within the same request.
   */
  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async create(dto: CreateCustomerDto) {
    try {
      const prisma = await this.getPrisma();
      const customer = await prisma.customer.create({ data: dto });
      this.invalidateCache();
      return customer;
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        throw new Error('Email already exists');
      }
      throw err;
    }
  }

  async findAll(pagination: PaginationQueryDto) {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }

    const prisma = await this.getPrisma();
    const result = await paginate(
      prisma.customer,
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

    const prisma = await this.getPrisma();
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (customer) {
      this.findOneCache.set(id, { data: customer, expires: now + CACHE_TTL });
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const prisma = await this.getPrisma();
    const customer = await prisma.customer.update({
      where: { id },
      data: dto,
    });
    this.invalidateCache(id);
    return customer;
  }

  async remove(id: string) {
    const prisma = await this.getPrisma();
    const customer = await prisma.customer.delete({ where: { id } });
    this.invalidateCache(id);
    return customer;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}