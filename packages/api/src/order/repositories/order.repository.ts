import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Order, OrderItem } from '@generated/prisma/client';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';
import { PageDto } from '@/common/pagination/dtos/page.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * DASHBOARD: Create a manual order.
   * millions of users: tenantId is automatically injected by the isolated client.
   */
  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    return this.prisma.client.order.create({
      data,
      include: {
        items: true,
        customer: true,
      },
    });
  }

  /**
   * GLOBAL/PUBLIC: Find order by ID.
   * Used for Guest Tracking. We use the base client here to allow 
   * tracking without a pre-set tenant header.
   */
  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { 
        items: true,
        customer: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        },
        tenant: {
          select: { name: true, subdomain: true }
        }
      },
    });
  }

  /**
   * DASHBOARD: List all orders for the store.
   * millions of users: Leverages the full Cache + Pagination + Isolation pipeline.
   */
  async list(options: PageOptionsDto): Promise<PageDto<Order>> {
    const where: Prisma.OrderWhereInput = {
      ...(options.search && {
        OR: [
          { orderNumber: { contains: options.search, mode: 'insensitive' } },
          { customer: { email: { contains: options.search, mode: 'insensitive' } } },
          { customer: { lastName: { contains: options.search, mode: 'insensitive' } } },
        ],
      }),
    };

    return this.prisma.client.order.paginate({
      options,
      where,
      include: { 
        customer: {
          select: { firstName: true, lastName: true, email: true }
        },
        _count: { select: { items: true } }
      },
      cache: true,
    });
  }

  /**
   * DASHBOARD: Update order status or details.
   * Uses isolated client to ensure you can only update YOUR orders.
   */
  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.client.order.update({
      where: { id },
      data,
    });
  }

  /**
   * DASHBOARD: Soft delete or remove order.
   */
  async delete(id: string): Promise<Order> {
    return this.prisma.client.order.delete({
      where: { id },
    });
  }

  /**
   * millions of users: Returns the total count of orders for the active tenant.
   * Leverages the isolated client to ensure the count is scoped automatically.
   */
  async count(where?: Prisma.OrderWhereInput): Promise<number> {
    return this.prisma.client.order.count({
      where,
    });
  }
  
  /**
   * CUSTOMER PORTAL: Find all orders for a specific customer email/ID.
   */
  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.prisma.client.order.findMany({
      where: { customerId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * INVENTORY MANAGEMENT: Add items to an existing order.
   */
  async addItems(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<OrderItem[]> {
    // Note: createMany is more efficient for high-volume order updates
    await this.prisma.client.orderItem.createMany({
      data: items.map((i) => ({ ...i, orderId })),
    });

    return this.prisma.client.orderItem.findMany({
      where: { orderId },
    });
  }
}