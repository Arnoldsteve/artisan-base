// C:\Users\USER\Documents\artisan-base\packages\api\src\order\repositories\order.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Order, OrderItem } from '@generated/prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new order with items
  async create(
    data: Prisma.OrderUncheckedCreateInput,
  ): Promise<Order> {
    return this.prisma.client.order.create({
      data,
      include: {
        items: true, // include order items
      },
    });
  }

  // Find order by ID and tenant
  async findById(id: string, tenantId: string): Promise<Order | null> {
    return this.prisma.client.order.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });
  }

  // Find orders by customer ID
  async findByCustomer(
    customerId: string,
    tenantId: string,
  ): Promise<Order[]> {
    return this.prisma.client.order.findMany({
      where: { customerId, tenantId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // List orders for a tenant (with pagination)
  async list(params: {
    tenantId: string;
    skip?: number;
    take?: number;
  }): Promise<Order[]> {
    const { tenantId, skip = 0, take = 10 } = params;
    return this.prisma.client.order.findMany({
      where: { tenantId },
      include: { items: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Count total orders for a tenant
  async count(tenantId: string): Promise<number> {
    return this.prisma.client.order.count({
      where: { tenantId },
    });
  }

  // Update order (status, addresses, etc.)
  async update(
    id: string,
    tenantId: string,
    data: Prisma.OrderUpdateInput,
  ): Promise<Order> {
    return this.prisma.client.order.updateMany({
      where: { id, tenantId },
      data,
    }).then(result => {
      if (result.count === 0) {
        throw new Error('Order not found or tenant mismatch');
      }
      return this.findById(id, tenantId) as Promise<Order>;
    });
  }

  // Delete an order by ID
  async delete(id: string, tenantId: string): Promise<Order> {
    // Ensure tenant isolation
    return this.prisma.client.order.deleteMany({
      where: { id, tenantId },
    }).then(result => {
      if (result.count === 0) {
        throw new Error('Order not found or tenant mismatch');
      }
      return { id } as Order; // Return a minimal object
    });
  }

  // Add items to an existing order
  async addItems(
    orderId: string,
    tenantId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<OrderItem[]> {
    return this.prisma.client.orderItem.createMany({
      data: items.map(i => ({ ...i, orderId, tenantId })),
    }).then(() => this.prisma.client.orderItem.findMany({
      where: { orderId, tenantId },
    }));
  }
}
