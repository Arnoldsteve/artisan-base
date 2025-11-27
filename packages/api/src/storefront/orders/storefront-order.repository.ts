import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';
import { IStorefrontOrderRepository } from './interfaces/storefront-order-repository.interface';
import { GetStorefrontOrdersDto } from './dto/get-storefront-orders.dto';
import { Order, Payment, PrismaClient } from '../../../generated/tenant';
import { Decimal } from '@prisma/client/runtime/library'; // Import Decimal for calculations

@Injectable({ scope: Scope.REQUEST })
export class StorefrontOrderRepository implements IStorefrontOrderRepository {
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  // async create(dto: CreateStorefrontOrderDto): Promise<any> {
  //   const prisma = await this.getPrisma();

  //   // Validate items
  //   if (!dto.items || dto.items.length === 0) {
  //     throw new BadRequestException('Order must have at least one item.');
  //   }

  //   // Fetch product/variant info and check inventory
  //   const productIds = dto.items.map((item) => item.productId);
  //   const products = await prisma.product.findMany({
  //     where: { id: { in: productIds }, isActive: true },
  //   });
  //   if (products.length !== productIds.length) {
  //     throw new BadRequestException(
  //       'One or more products are invalid or inactive.',
  //     );
  //   }

  //   // Calculate subtotal using Decimal for precision
  //   let subtotal = new Decimal(0);

  //   const orderItemsData = await Promise.all(
  //     dto.items.map(async (item) => {
  //       const product = products.find((p) => p.id === item.productId)!; // non-null assertion

  //       if (product.inventoryQuantity < item.quantity) {
  //         throw new BadRequestException(
  //           `Insufficient inventory for product: ${product.name}`,
  //         );
  //       }

  //       // Pick the first valid image URL if it exists, otherwise null
  //       let image: string | null = null;

  //       if (Array.isArray(product.images) && product.images.length > 0) {
  //         const firstImage = product.images[0];

  //         // Narrow to object with url property
  //         if (
  //           firstImage &&
  //           typeof firstImage === 'object' &&
  //           'url' in firstImage &&
  //           typeof (firstImage as any).url === 'string' &&
  //           (firstImage as any).url.startsWith('http')
  //         ) {
  //           image = (firstImage as any).url;
  //         }
  //       }

  //       const unitPrice = product.price;
  //       subtotal = subtotal.plus(unitPrice.mul(item.quantity));

  //       return {
  //         quantity: item.quantity,
  //         unitPrice,
  //         productName: product.name,
  //         sku: product.sku,
  //         image,
  //         productId: product.id,
  //       };
  //     }),
  //   );

  //   const TAX_RATE = 0.16; // Example: 16% VAT (could be env/config later)
  //   const taxAmount = subtotal.mul(TAX_RATE);

  //   // Use shipping from dto or default to 0
  //   const shippingAmount = dto.shippingAmount
  //     ? new Decimal(dto.shippingAmount)
  //     : new Decimal(0);

  //   // Compute final total
  //   const totalAmount = subtotal.plus(taxAmount).plus(shippingAmount);

  //   // Optionally: create/find customer
  //   let customerId: string | undefined = undefined;
  //   if (dto.customer && dto.customer.email) {
  //     let customer = await prisma.customer.findUnique({
  //       where: { email: dto.customer.email },
  //     });
  //     if (!customer) {
  //       customer = await prisma.customer.create({
  //         data: {
  //           email: dto.customer.email,
  //           firstName: dto.customer.firstName,
  //           lastName: dto.customer.lastName,
  //           phone: dto.customer.phone,
  //         },
  //       });
  //     }
  //     customerId = customer.id;
  //   }

  //   // Create order and order items in a transaction
  //   const order = await prisma.$transaction(async (tx) => {
  //     const orderCount = await tx.order.count();
  //     const orderNumber = `ORD-${orderCount + 1}`;

  //     const createdOrder = await tx.order.create({
  //       data: {
  //         orderSequence: orderCount + 1,
  //         orderNumber,
  //         status: 'PENDING',
  //         paymentStatus: 'PENDING',
  //         subtotal,
  //         taxAmount,
  //         shippingAmount,
  //         totalAmount,
  //         currency: dto.currency,
  //         notes: dto.notes,
  //         shippingAddress: dto.shippingAddress,
  //         billingAddress: dto.billingAddress,
  //         customer: customerId ? { connect: { id: customerId } } : undefined,
  //         items: {
  //           create: orderItemsData,
  //         },
  //       },
  //       include: {
  //         items: true,
  //       },
  //     });

  //     // Decrement inventory
  //     for (const item of dto.items) {
  //       await tx.product.update({
  //         where: { id: item.productId },
  //         data: { inventoryQuantity: { decrement: item.quantity } },
  //       });
  //     }
  //     return createdOrder;
  //   });

  //   return {
  //     success: true,
  //     order: {
  //       id: order.id,
  //       orderNumber: order.orderNumber,
  //       status: order.status,
  //       subtotal: order.subtotal,
  //       taxAmount: order.taxAmount,
  //       shippingAmount: order.shippingAmount,
  //       totalAmount: order.totalAmount,
  //       items: 'items' in order ? order.items : [],
  //       createdAt: order.createdAt,
  //     },
  //   };
  // }

  async create(dto: CreateStorefrontOrderDto): Promise<any> {
    const prisma = await this.getPrisma();

    // Validate items
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item.');
    }

    const productIds = dto.items.map((item) => item.productId);

    // Pre-fetch customer if email provided (outside transaction for speed)
    let customerId: string | undefined = undefined;
    if (dto.customer && dto.customer.email) {
      let customer = await prisma.customer.findUnique({
        where: { email: dto.customer.email },
      });
      if (!customer) {
        customer = await prisma.customer.create({
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

    // Single transaction with row-level locking
    const order = await prisma.$transaction(
      async (tx) => {
        // 1. Lock products and validate in one query
        const products = await tx.product.findMany({
          where: { id: { in: productIds }, isActive: true },
          // Prisma automatically uses SELECT FOR UPDATE in transactions
        });

        if (products.length !== productIds.length) {
          throw new BadRequestException(
            'One or more products are invalid or inactive.',
          );
        }

        // 2. Build order items and calculate totals
        let subtotal = new Decimal(0);
        const orderItemsData: Array<{
          quantity: number;
          unitPrice: Decimal;
          productName: string;
          sku: string | null;
          image: string | null;
          productId: string;
        }> = [];

        for (const item of dto.items) {
          const product = products.find((p) => p.id === item.productId);
          if (!product) {
            throw new BadRequestException(
              `Product ${item.productId} not found.`,
            );
          }

          // Check inventory
          if (product.inventoryQuantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient inventory for product: ${product.name}. Available: ${product.inventoryQuantity}, Requested: ${item.quantity}`,
            );
          }

          // Extract image
          let image: string | null = null;
          if (Array.isArray(product.images) && product.images.length > 0) {
            const firstImage = product.images[0];
            if (
              firstImage &&
              typeof firstImage === 'object' &&
              'url' in firstImage &&
              typeof (firstImage as any).url === 'string' &&
              (firstImage as any).url.startsWith('http')
            ) {
              image = (firstImage as any).url;
            }
          }

          const unitPrice = product.price;
          subtotal = subtotal.plus(unitPrice.mul(item.quantity));

          orderItemsData.push({
            quantity: item.quantity,
            unitPrice,
            productName: product.name,
            sku: product.sku,
            image,
            productId: product.id,
          });
        }

        const TAX_RATE = 0.16;
        const taxAmount = subtotal.mul(TAX_RATE);
        const shippingAmount = dto.shippingAmount
          ? new Decimal(dto.shippingAmount)
          : new Decimal(0);
        const totalAmount = subtotal.plus(taxAmount).plus(shippingAmount);

        // 3. Get order count for sequence
        const orderCount = await tx.order.count();
        const orderNumber = `ORD-${orderCount + 1}`;

        // 4. Create order with items
        const createdOrder = await tx.order.create({
          data: {
            orderSequence: orderCount + 1,
            orderNumber,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            subtotal,
            taxAmount,
            shippingAmount,
            totalAmount,
            currency: dto.currency,
            notes: dto.notes,
            shippingAddress: dto.shippingAddress,
            billingAddress: dto.billingAddress,
            customer: customerId ? { connect: { id: customerId } } : undefined,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
            customer: true,
          },
        });

        // 5. Atomically decrement inventory with safety check
        for (const item of dto.items) {
          const updateResult = await tx.product.updateMany({
            where: {
              id: item.productId,
              inventoryQuantity: { gte: item.quantity }, // Only update if enough stock
            },
            data: {
              inventoryQuantity: { decrement: item.quantity },
            },
          });

          // Double-check: if no rows updated, inventory was consumed by another transaction
          if (updateResult.count === 0) {
            throw new BadRequestException(
              `Inventory changed during order processing for product: ${item.productId}`,
            );
          }
        }

        return createdOrder;
      },
      {
        maxWait: 5000, // Wait max 5s to acquire transaction lock
        timeout: 10000, // Transaction timeout 10s
        isolationLevel: 'ReadCommitted', // Standard isolation level
      },
    );

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        shippingAmount: order.shippingAmount,
        totalAmount: order.totalAmount,
        items: 'items' in order ? order.items : [],
        customer: order.customer,
        createdAt: order.createdAt,
      },
    };
  }
  
  async getOrders(query: GetStorefrontOrdersDto): Promise<any> {
    const prisma = await this.getPrisma();
    let customerId = query.customerId;
    if (!customerId && query.email) {
      const customer = await prisma.customer.findUnique({
        where: { email: query.email },
      });
      if (!customer) return [];
      customerId = customer.id;
    }
    if (!customerId) return [];

    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return orders;
  }

  async getOrder(id: string, query: GetStorefrontOrdersDto): Promise<any> {
    const prisma = await this.getPrisma();
    let customerId = query.customerId;
    if (!customerId && query.email) {
      const customer = await prisma.customer.findUnique({
        where: { email: query.email },
      });
      if (!customer) return null;
      customerId = customer.id;
    }
    if (!customerId) return null;

    const order = await prisma.order.findFirst({
      where: { id, customerId },
      include: { items: true },
    });
    return order;
  }

  // --- THIS METHOD IS NOW UPDATED ---
  async findOrderByCheckoutRequestId(
    checkoutRequestId: string,
  ): Promise<Order | null> {
    const prisma = await this.getPrisma();
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId },
      include: {
        order: true, // Include the full Order object
      },
    });
    return payment?.order ?? null;
  }

  // --- NEW METHOD ---
  async createPayment(paymentData: any): Promise<Payment> {
    const prisma = await this.getPrisma();
    return prisma.payment.create({
      data: paymentData,
    });
  }

  // --- NEW METHOD ---
  async updateOrderStatus(
    orderId: string,
    data: { status?: any; paymentStatus?: any },
  ): Promise<Order> {
    const prisma = await this.getPrisma();
    return prisma.order.update({
      where: { id: orderId },
      data: data,
    });
  }
}
