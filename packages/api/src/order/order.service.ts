import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { ProductRepository } from '@/product/repositories/product.repository';
import { UserRepository } from '@/user/repositories/user.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';
import { CheckoutPayloadDto } from './dto/checkout-payload.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentStatus, OrderStatus, PaymentType } from '@generated/prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly userRepo: UserRepository,
    private readonly tenantContext: TenantContextService,
  ) {}

 /**
   * TOP 1% LOGIC: Multi-Vendor Marketplace Checkout
   * millions of users: Orchestrates a single transaction that splits a global cart 
   * into isolated merchant orders with verified financial totals.
   */
  async createMarketplaceOrder(dto: CheckoutPayloadDto) {
    // 1. PERFORMANCE: Fetch all involved products once to get "Truth" prices
    const productIds = dto.vendors.flatMap((v) =>
      v.items.map((i) => i.productId),
    );
    const dbProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    try {
      /**
       * GLOBAL ATOMIC TRANSACTION
       * We use 'this.prisma' (Base Client) because we need to write to 
       * different tenant rows in a single database handshake.
       */
      return await this.prisma.$transaction(async (tx) => {
        // --- Step A: Customer Identity Management ---
        // We link the customer to the primary store in the checkout
        const customer = await tx.customer.upsert({
          where: {
            tenantId_email: {
              tenantId: dto.vendors[0].tenantId,
              email: dto.customer.email,
            },
          },
          update: {
            firstName: dto.customer.firstName,
            lastName: dto.customer.lastName,
            phone: dto.customer.phone,
          },
          create: {
            tenantId: dto.vendors[0].tenantId,
            email: dto.customer.email,
            firstName: dto.customer.firstName,
            lastName: dto.customer.lastName,
            phone: dto.customer.phone,
          },
        });

        const orderIds: string[] = [];
        let globalTotalAmount = 0; // Accumulator for the single payment record

        // --- Step B: Vendor Isolation Loop ---
        for (const vendor of dto.vendors) {
          let vendorSubtotal = 0;

          // Map items and verify prices against the database (Anti-Fraud)
          const orderItemsData = vendor.items.map((item) => {
            const dbProduct = dbProducts.find((p) => p.id === item.productId);
            if (!dbProduct) {
              throw new BadRequestException(`Product ${item.productId} is no longer available.`);
            }

            const unitPrice = Number(dbProduct.price);
            const lineTotal = unitPrice * item.quantity;
            vendorSubtotal += lineTotal;

            return {
              productId: dbProduct.id,
              productName: dbProduct.name,
              unitPrice: unitPrice,
              quantity: item.quantity,
              tenantId: vendor.tenantId, // Stamp isolation on the line item
            };
          });

          // Enterprise Financial Logic (Tax & Shipping distribution)
          const TAX_RATE = 0.16; // 16% VAT Example
          const vendorTax = vendorSubtotal * TAX_RATE;
          const vendorShipping = 600; // Placeholder: In production, calculate based on vendor.shippingMethodId
          const vendorTotal = vendorSubtotal + vendorTax + vendorShipping;

          // Track for Global Payment entry
          globalTotalAmount += vendorTotal;

          // Create the isolated Order for this specific artisan
          const order = await tx.order.create({
            data: {
              tenantId: vendor.tenantId,
              orderNumber: `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
              status: OrderStatus.PENDING,
              paymentStatus: PaymentStatus.PENDING,
              currency: dto.currency,
              
              // POPULATING BREAKDOWN FIELDS (Fixes the 0.00 issue)
              subtotal: vendorSubtotal,
              taxAmount: vendorTax,
              shippingAmount: vendorShipping,
              totalAmount: vendorTotal,
              
              shippingAddress: dto.shippingAddress as any,
              billingAddress: dto.shippingAddress as any, // Standard: Default billing to shipping
              customerId: customer.id,
              items: {
                create: orderItemsData,
              },
            },
          });

          orderIds.push(order.id);
        }

        // --- Step C: Create Unified Payment Audit Trail ---
        const paymentReference = `PAY-${Date.now()}`;
        await tx.payment.create({
          data: {
            tenantId: dto.vendors[0].tenantId, // Primary store context
            type: PaymentType.ORDER,
            provider: dto.paymentProvider as any,
            providerTransactionId: paymentReference,
            amount: globalTotalAmount, // Correct total of all sub-orders
            status: PaymentStatus.PENDING,
            metadata: {
              orderIds,
              customerEmail: customer.email,
            },
          },
        });

        return {
          orderIds,
          paymentReference,
          customer: {
            email: customer.email,
            firstName: customer.firstName,
          },
        };
      });
    } catch (error) {
      // Logic for logging and graceful failure at scale
      if (error instanceof BadRequestException) throw error;
      console.error('[Marketplace Order Error]:', error);
      throw new InternalServerErrorException('Checkout failed. Our artisans are aware and we are fixing it.');
    }
  }

  async findAll(options: PageOptionsDto) {
    return this.orderRepo.list(options);
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByCustomer(customerId: string) {
    return this.orderRepo.findByCustomer(customerId);
  }

  /**
   * FIX for Error 2: Match new Repo signature (2 args)
   */
 async update(id: string, dto: UpdateOrderDto) {
    // 1. Ensure order exists first (Business Rule)
    const order = await this.findOne(id);

    /**
     * TOP 1% LOGIC: Data Transformation
     * We destructure the DTO to separate fields.
     * We remove 'items' because updating line items requires complex logic (re-calculating totals).
     */
    const { items, shippingAddress, billingAddress, ...rest } = dto;

    // 2. Construct a clean update object
    // We cast addresses to 'any' or spread them to satisfy Prisma's Json requirement
    const updateData: any = {
      ...rest,
      ...(shippingAddress && { shippingAddress: { ...shippingAddress } }),
      ...(billingAddress && { billingAddress: { ...billingAddress } }),
    };

    // 3. Delegate to Repo
    return this.orderRepo.update(id, updateData);
  }

  /**
   * FIX for Error 3: Match new Repo signature (1 arg)
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.orderRepo.delete(id);
  }

  async addItems(orderId: string, items: any[]) {
    await this.findOne(orderId);
    return this.orderRepo.addItems(orderId, items);
  }

  // Simplified manual creation for Dashboard
  async create(dto: any) {
    return this.orderRepo.create(dto);
  }
}