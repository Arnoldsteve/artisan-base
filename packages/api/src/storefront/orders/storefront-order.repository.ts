import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';
import { IStorefrontOrderRepository } from './interfaces/storefront-order-repository.interface';
import { GetStorefrontOrdersDto } from './dto/get-storefront-orders.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontOrderRepository implements IStorefrontOrderRepository {
  constructor(private readonly prisma: TenantPrismaService) {}

  async create(dto: CreateStorefrontOrderDto): Promise<any> {
    // Validate items
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item.');
    }

    // Fetch product/variant info and check inventory
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'One or more products are invalid or inactive.',
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItemsData = await Promise.all(
      dto.items.map(async (item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new BadRequestException('Invalid product.');
        if (product.inventoryQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient inventory for product: ${product.name}`,
          );
        }
        const unitPrice = Number(product.price);
        subtotal += unitPrice * item.quantity;
        return {
          quantity: item.quantity,
          unitPrice,
          productName: product.name,
          sku: product.sku,
          image:
            Array.isArray(product.images) && product.images.length > 0
              ? String(product.images[0])
              : null,
          productId: product.id,
        };
      }),
    );

    // Optionally: create/find customer
    let customerId: string | undefined = undefined;
    if (dto.customer && dto.customer.email) {
      let customer = await this.prisma.customer.findUnique({
        where: { email: dto.customer.email },
      });
      if (!customer) {
        customer = await this.prisma.customer.create({
          data: {
            email: dto.customer.email,
            firstName: dto.customer.firstName,
            lastName: dto.customer.lastName,
            phone: dto.customer.phone,
          },
        });
      }
      customerId = customer.id;
    }

    // Create order and order items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Generate order number (simple example)
      const orderCount = await tx.order.count();
      const orderNumber = `ORD-${orderCount + 1}`;
      const createdOrder = await tx.order.create({
        data: {
          orderSequence: orderCount + 1,
          orderNumber,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          totalAmount: subtotal, // Add tax/shipping if needed
          subtotal,
          taxAmount: 0,
          shippingAmount: 0,
          notes: dto.notes,
          shippingAddress: dto.shippingAddress,
          billingAddress: dto.billingAddress,
          customerId,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Decrement inventory
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventoryQuantity: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        items: 'items' in order ? order.items : [],
        createdAt: order.createdAt,
      },
    };
  }

  async getOrders(query: GetStorefrontOrdersDto): Promise<any> {
    // Find customer by email or customerId
    let customerId = query.customerId;
    if (!customerId && query.email) {
      const customer = await this.prisma.customer.findUnique({
        where: { email: query.email },
      });
      if (!customer) return [];
      customerId = customer.id;
    }
    if (!customerId) return [];
    // Fetch orders for customer
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return orders;
  }

  async getOrder(id: string, query: GetStorefrontOrdersDto): Promise<any> {
    // Find customer by email or customerId
    let customerId = query.customerId;
    if (!customerId && query.email) {
      const customer = await this.prisma.customer.findUnique({
        where: { email: query.email },
      });
      if (!customer) return null;
      customerId = customer.id;
    }
    if (!customerId) return null;
    // Fetch order by id and customerId
    const order = await this.prisma.order.findFirst({
      where: { id, customerId },
      include: { items: true },
    });
    return order;
  }
}
