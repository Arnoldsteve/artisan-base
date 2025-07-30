import { Injectable, Scope, OnModuleInit } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { ICustomerRepository } from './interfaces/customer-repository.interface';
import { PrismaClient } from '../../../generated/tenant'; // Import the actual PrismaClient type

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

// Make the repository request-scoped to ensure cache is not shared across requests/tenants
@Injectable({ scope: Scope.REQUEST })
export class CustomerRepository implements ICustomerRepository, OnModuleInit {
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

  async create(dto: CreateCustomerDto) {
    try {
      const customer = await this.prisma.customer.create({ data: dto });
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
      this.prisma.customer,
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
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (customer) {
      this.findOneCache.set(id, { data: customer, expires: now + CACHE_TTL });
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: dto,
    });
    this.invalidateCache(id);
    return customer;
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.delete({ where: { id } });
    this.invalidateCache(id);
    return customer;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}