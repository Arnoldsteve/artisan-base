import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Scope,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import {
  CreateManualOrderDto,
  UpdateOrderDto,
  UpdatePaymentStatusDto,
} from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { IOrderRepository } from './interfaces/order-repository.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '../../../generated/tenant';

const CACHE_TTL = 10 * 1000; // 10 seconds for demo

@Injectable({ scope: Scope.REQUEST })
export class OrderRepository implements IOrderRepository {
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

  async createManualOrder(dto: CreateManualOrderDto) {
    const prisma = await this.getPrisma();
    const {
      items,
      customer,
      shippingAddress,
      billingAddress,
      notes,
      shippingAmount,
    } = dto;
    return prisma.$transaction(async (tx) => {
      // 1. Find or create the customer
      const customerRecord = await tx.customer.upsert({
        where: { email: customer.email },
        update: { firstName: customer.firstName, lastName: customer.lastName },
        create: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
      });
      // 2. Fetch all products/variants at once for efficiency
      const productIds = items.map((i) => i.productId);
      const variantIds = items
        .map((i) => i.variantId)
        .filter((id): id is string => typeof id === 'string');
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
      });
      let subtotal = new Decimal(0);
      const orderItemsData: Array<any> = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new NotFoundException(
            `Product with ID ${item.productId} not found.`,
          );
        let stock = product.inventoryQuantity;
        let price = product.price; // price is already a Decimal
        let variantName: string | null = null;
        let variantSku: string | null = null;
        if (item.variantId) {
          const variant = variants.find((v) => v.id === item.variantId);
          if (!variant)
            throw new NotFoundException(
              `Variant with ID ${item.variantId} not found.`,
            );
          if (variant.productId !== product.id)
            throw new BadRequestException(
              `Variant ${variant.id} does not belong to product ${product.id}.`,
            );
          stock = variant.inventoryQuantity;
          price = variant.price ?? product.price; // price is already a Decimal
          variantName = variant.name;
          variantSku = variant.sku;
        }
        if (stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${product.name} ${variantName ? `(${variantName})` : ''}.`,
          );
        }
        // Use Decimal methods for precise calculation
        const lineItemTotal = price.mul(item.quantity);
        subtotal = subtotal.plus(lineItemTotal);
        orderItemsData.push({
          productId: product.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: price,
          productName: product.name,
          variantName: variantName,
          sku: variantSku ?? product.sku,
          image: (product.images as any)?.[0]?.url ?? null,
        });
      }
      const finalShipping = new Decimal(shippingAmount ?? 0);
      const finalTax = new Decimal(0);
      const totalAmount = subtotal.plus(finalShipping).plus(finalTax);
      const lastOrder = await tx.order.findFirst({
        orderBy: { orderSequence: 'desc' },
      });
      const newSequence = (lastOrder?.orderSequence ?? 0) + 1;
      const orderNumber = `ORD-${String(newSequence).padStart(6, '0')}`;
      const order = await tx.order.create({
        data: {
          orderSequence: newSequence,
          orderNumber,
          customerId: customerRecord.id,
          subtotal,
          shippingAmount: finalShipping,
          taxAmount: finalTax,
          totalAmount,
          notes,
          shippingAddress: shippingAddress as any,
          billingAddress: (billingAddress ?? shippingAddress) as any,
          items: { create: orderItemsData },
        },
        include: { items: true, customer: true },
      });
      for (const item of items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { inventoryQuantity: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { inventoryQuantity: { decrement: item.quantity } },
          });
        }
      }
      this.invalidateCache();
      return order;
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const now = Date.now();
    if (this.findAllCache && this.findAllCache.expires > now) {
      return this.findAllCache.data;
    }
    Logger.log(
      `Fetching orders with pagination: ${JSON.stringify(paginationQuery)}`,
      OrderRepository.name,
    );
    const prisma = await this.getPrisma();
    const result = await paginate(
      prisma.order,
      {
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      },
      {
        orderBy: { orderSequence: 'desc' },
        include: {
          _count: { select: { items: true } },
        },
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
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (order) {
      this.findOneCache.set(id, { data: order, expires: now + CACHE_TTL });
    }
    return order;
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order with ID '${id}' not found.`);
    const prisma = await this.getPrisma();
    const updated = await prisma.order.update({
      where: { id },
      data: { status: updateOrderDto.status },
    });
    this.invalidateCache(id);
    return updated;
  }

  async updatePaymentStatus(
    id: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order with ID '${id}' not found.`);
    const prisma = await this.getPrisma();
    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus: updatePaymentStatusDto.paymentStatus },
    });
    this.invalidateCache(id);
    return updated;
  }

  private invalidateCache(id?: string) {
    if (id) this.findOneCache.delete(id);
    else this.findOneCache.clear();
    this.findAllCache = null;
  }
}