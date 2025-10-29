import { Injectable, Logger, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { ICustomerRepository } from './interfaces/customer-repository.interface';
import { PrismaClient, Customer, Order, Address } from '../../../generated/tenant';
import { Decimal } from '@prisma/client/runtime/library';

const CACHE_TTL = 10 * 1000;

// Define a type for the rich Customer object returned by our specific query
type CustomerWithRelations = Customer & {
  orders: { totalAmount: Decimal }[];
  addresses: Address[];
  _count: { orders: number };
};

@Injectable({ scope: Scope.REQUEST })
export class CustomerRepository implements ICustomerRepository {
  private readonly logger = new Logger(CustomerRepository.name);
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

  async create(dto: CreateCustomerDto) {
    const prisma = await this.getPrisma();
    const { addresses, ...customerData } = dto;
    try {
      const newCustomer = await prisma.$transaction(async (tx) => {
        const customer = await tx.customer.create({ data: customerData });
        if (addresses && addresses.length > 0) {
          await tx.address.createMany({
            data: addresses.map(address => ({ ...address, customerId: customer.id })),
          });
        }
        return customer;
      });
      this.invalidateCache();
      return prisma.customer.findUnique({
        where: { id: newCustomer.id },
        include: { addresses: true },
      });
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        throw new Error('Email already exists');
      }
      throw err;
    }
  }

  /**
   * Finds all customers using the centralized, search-aware paginate helper,
   * then transforms the data to the desired shape.
   */
  async findAll(pagination: PaginationQueryDto) {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }

    const prisma = await this.getPrisma();
    
    // --- STEP 1: Fetch data using the paginate helper ---
    const paginatedResult = await paginate<CustomerWithRelations>( // Use our specific type here
      prisma.customer,
      {
        page: pagination.page,
        limit: pagination.limit,
        search: pagination.search,
        searchableFields: ['firstName', 'lastName', 'email'],
      },
      {
        // Define the rich data to include for each customer
        orderBy: { createdAt: 'desc' },
        include: {
          addresses: true,
          _count: { select: { orders: true } },
          orders: { select: { totalAmount: true } },
        },
      }
    );

    // --- STEP 2: Transform the paginated data ---
    const customersWithStats = paginatedResult.data.map((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum.plus(order.totalAmount),
        new Decimal(0)
      );
      const shippingAddress = customer.addresses.find(addr => addr.isDefault && addr.type === 'shipping') || customer.addresses.find(addr => addr.type === 'shipping');
      const billingAddress = customer.addresses.find(addr => addr.isDefault && addr.type === 'billing') || customer.addresses.find(addr => addr.type === 'billing');
      
      const { orders, addresses, ...customerData } = customer;
      
      return { ...customerData, totalSpent, shipping: shippingAddress || null, billing: billingAddress || null };
    });

    const result = {
      ...paginatedResult, // Keep the original meta object
      data: customersWithStats, // Replace the data array with our transformed version
    };

    this.findAllCache = { data: result, expires: now + CACHE_TTL };
    this.logger.log(`Fetched ${result.data.length} customers with pagination`);
    return result;
  }

  async findOne(id: string) {
    const now = Date.now();
    const cached = this.findOneCache.get(id);
    if (cached && cached.expires > now) { return cached.data; }

    const prisma = await this.getPrisma();
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { addresses: true, orders: { orderBy: { createdAt: 'desc' } } },
    });

    if (customer) { this.findOneCache.set(id, { data: customer, expires: now + CACHE_TTL }); }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const prisma = await this.getPrisma();
    const customer = await prisma.customer.update({ where: { id }, data: dto });
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
    this.findAllCache = null;
    this.logger.log(`Cache invalidated for customer(s) ${id ? `: ${id}` : '(all)'}`);
  }
}