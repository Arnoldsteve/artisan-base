import { Injectable, Logger, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ICustomerRepository } from './interfaces/customer-repository.interface';
import { PrismaClient } from '../../../generated/tenant';
import { Decimal } from '@prisma/client/runtime/library';

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable({ scope: Scope.REQUEST })
export class CustomerRepository implements ICustomerRepository {
  private readonly logger = new Logger(CustomerRepository.name);
  private findOneCache = new Map<string, { data: any; expires: number }>();
  private findAllCache: { data: any; expires: number } | null = null;

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

  /**
   * Creates a new customer and, optionally, their associated addresses in a single transaction.
   */
  async create(dto: CreateCustomerDto) {
    const prisma = await this.getPrisma();
    const { addresses, ...customerData } = dto;

    try {
      const newCustomer = await prisma.$transaction(async (tx) => {
        // 1. Create the core customer record
        const customer = await tx.customer.create({
          data: customerData,
        });

        // 2. If addresses were provided, create them and link them
        if (addresses && addresses.length > 0) {
          await tx.address.createMany({
            data: addresses.map(address => ({
              ...address,
              customerId: customer.id, // Link to the new customer's ID
            })),
          });
        }
        return customer;
      });

      this.invalidateCache();

      // 3. Fetch and return the full customer object with its new addresses
      return prisma.customer.findUnique({
        where: { id: newCustomer.id },
        include: {
          addresses: true,
        },
      });

    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        throw new Error('Email already exists');
      }
      throw err;
    }
  }

  /**
   * Finds all customers with pagination and includes aggregated order stats.
   */
  async findAll(pagination: PaginationQueryDto) {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }

    const prisma = await this.getPrisma();
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          // The query to fetch the data remains the same
          addresses: true,
          _count: {
            select: { orders: true },
          },
          orders: {
            select: { totalAmount: true },
          },
        },
      }),
      prisma.customer.count(),
    ]);

    // --- THIS IS THE UPDATED DATA TRANSFORMATION BLOCK ---
    const customersWithStats = customers.map(customer => {
      // Order stats calculation remains the same
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum.plus(order.totalAmount),
        new Decimal(0)
      );

      // --- NEW: Restructure the addresses ---
      // Find the default shipping and billing addresses from the array.
      // This logic prioritizes the 'default' and then the specific type.
      const shippingAddress = 
        customer.addresses.find(addr => addr.isDefault && addr.type === 'shipping') ||
        customer.addresses.find(addr => addr.type === 'shipping');

      const billingAddress = 
        customer.addresses.find(addr => addr.isDefault && addr.type === 'billing') ||
        customer.addresses.find(addr => addr.type === 'billing');

      // Remove the temporary `orders` and `addresses` arrays from the customer object
      const { orders, addresses, ...customerData } = customer;

      // Return the final, beautifully structured object
      return {
        ...customerData,
        totalSpent,
        shipping: shippingAddress || null, // Return the found address or null
        billing: billingAddress || null,   // Return the found address or null
      };
    });

    const result = {
      data: customersWithStats,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
    
    this.findAllCache = { data: result, expires: now + CACHE_TTL };
    this.logger.log(`Fetched ${result.data.length} customers with pagination`);
    return result;
  }

  /**
   * Finds a single customer by their ID, including all related orders and addresses.
   */
  async findOne(id: string) {
    const now = Date.now();
    const cached = this.findOneCache.get(id);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const prisma = await this.getPrisma();
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true, // Also include addresses when fetching a single customer
        orders: {
          orderBy: { createdAt: 'desc' }, // Include a list of their orders
        },
      },
    });

    if (customer) {
      this.findOneCache.set(id, { data: customer, expires: now + CACHE_TTL });
    }
    return customer;
  }

  /**
   * Updates a customer's core details.
   */
  async update(id: string, dto: UpdateCustomerDto) {
    const prisma = await this.getPrisma();
    const customer = await prisma.customer.update({
      where: { id },
      data: dto,
    });
    this.invalidateCache(id);
    return customer;
  }

  /**
   * Deletes a customer and all their related records (e.g., addresses) via cascading delete.
   */
  async remove(id: string) {
    const prisma = await this.getPrisma();
    const customer = await prisma.customer.delete({ where: { id } });
    this.invalidateCache(id);
    return customer;
  }
  
  // Note: getProfile is not needed here as findOne serves the same purpose.
  // It can be removed to avoid duplication unless it has a different logic.

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    this.findAllCache = null;
    this.logger.log(`Cache invalidated for customer(s) ${id || ''}`);
  }
}