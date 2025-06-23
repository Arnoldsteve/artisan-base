import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async findAllForTenant(tenantId: string) {
    const prisma = this.tenantPrisma.getClient(tenantId);

    return prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // Include the items and the product details for each item
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(tenantId: string, createOrderDto: CreateOrderDto) {
    const prisma = this.tenantPrisma.getClient(tenantId);

    // Use a transaction to ensure all or none of the operations succeed
    return prisma.$transaction(async (tx) => {
      // 1. Get all the product IDs from the incoming order
      const productIds = createOrderDto.items.map((item) => item.productId);

      // 2. Fetch the actual products from the database to get their real prices
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      // Ensure all requested products were found
      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products were not found.');
      }

      // 3. Calculate the total amount on the backend to prevent price tampering
      let totalAmount = 0;
      for (const item of createOrderDto.items) {
        const product = products.find((p) => p.id === item.productId);
        // The ! tells TypeScript we know the product exists because of the check above
        totalAmount += product!.price.toNumber() * item.quantity;
      }

      // 4. Create the main Order record
      const order = await tx.order.create({
        data: {
          customerEmail: createOrderDto.customerEmail,
          totalAmount: totalAmount,
          // The items are created in a nested write
          items: {
            create: createOrderDto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        // Include the created items in the response
        include: {
          items: true,
        },
      });

      return order;
    });
  }
}
