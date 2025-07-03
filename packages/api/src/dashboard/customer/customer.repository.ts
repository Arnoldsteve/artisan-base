import { Injectable, Logger } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { ICustomerRepository } from './interfaces/customer-repository.interface';

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;

  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(dto: CreateCustomerDto) {
    try {
      const customer = await this.tenantPrisma.customer.create({ data: dto });
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
    const result = await paginate(
      this.tenantPrisma.customer,
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
    const customer = await this.tenantPrisma.customer.findUnique({
      where: { id },
    });
    if (customer) {
      this.findOneCache.set(id, { data: customer, expires: now + CACHE_TTL });
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.tenantPrisma.customer.update({
      where: { id },
      data: dto,
    });
    this.invalidateCache(id);
    return customer;
  }

  async remove(id: string) {
    const customer = await this.tenantPrisma.customer.delete({ where: { id } });
    this.invalidateCache(id);
    return customer;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}
