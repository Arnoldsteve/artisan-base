import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { ProductRepository } from '@/product/repositories/product.repository';
import { UserRepository } from '@/user/repositories/user.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';
import { CheckoutPayloadDto } from './dto/checkout-payload.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  PaymentStatus,
  OrderStatus,
  PaymentType,
} from '@generated/prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CheckoutCompletedEvent,
  ORDER_EVENTS,
  OrderCreatedEvent,
} from './events/order.events';
import { PaymentService } from '@/payment/payment.service';
import { PaymentProviderRegistry } from '@/payment/providers/payment-provider.registry';
import { PaymentFulfillmentType } from '@/payment/interfaces/payment-provider.interface';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly userRepo: UserRepository,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentService: PaymentService, 
    private readonly paymentRegistry: PaymentProviderRegistry, 
  ) {}

  /**
   * TOP 1% LOGIC: Multi-Vendor Marketplace Checkout
   * millions of users: Orchestrates a single transaction that splits a global cart
   * into isolated merchant orders with verified financial totals.
   */
  async createMarketplaceOrder(dto: CheckoutPayloadDto) {
    const productIds = dto.vendors.flatMap((v) =>
      v.items.map((i) => i.productId),
    );
    const dbProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    /**
     * TOP 1% ARCHITECTURE: Atomic Multi-Vendor Transaction
     */
    const result = await this.prisma.$transaction(async (tx) => {
      // Step A: Upsert Customer
      const customer = await tx.customer.upsert({
        where: {
          tenantId_email: {
            tenantId: dto.vendors[0].tenantId,
            email: dto.customer.email,
          },
        },
        update: { phone: dto.customer.phone },
        create: {
          tenantId: dto.vendors[0].tenantId,
          email: dto.customer.email,
          firstName: dto.customer.firstName,
          lastName: dto.customer.lastName,
          phone: dto.customer.phone,
        },
      });

      const orderResults = []; // To store data for individual events
      let globalTotalAmount = 0;

      // Step B: Loop through each vendor
      for (const vendor of dto.vendors) {
        let vendorSubtotal = 0;
        const orderItemsData = vendor.items.map((item) => {
          const dbProduct = dbProducts.find((p) => p.id === item.productId);
          if (!dbProduct)
            throw new BadRequestException(`Product ${item.productId} missing.`);

          const unitPrice = Number(dbProduct.price);
          vendorSubtotal += unitPrice * item.quantity;

          return {
            productId: dbProduct.id,
            productName: dbProduct.name,
            unitPrice,
            quantity: item.quantity,
            tenantId: vendor.tenantId,
          };
        });

        const vendorTax = vendorSubtotal * 0; // Simplified tax logic for demo, was 1.16 which is 16% VAT
        const vendorShipping = 0; // Simplified for demo
        const vendorTotal = vendorSubtotal + vendorTax + vendorShipping;
        globalTotalAmount += vendorTotal;

        const order = await tx.order.create({
          data: {
            tenantId: vendor.tenantId,
            orderNumber: `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            currency: dto.currency,
            subtotal: vendorSubtotal,
            taxAmount: vendorTax,
            shippingAmount: vendorShipping,
            totalAmount: vendorTotal,
            shippingAddress: dto.shippingAddress as any,
            billingAddress: dto.shippingAddress as any,
            customerId: customer.id,
            items: { create: orderItemsData },
          },
        });

        // Collect data for the per-order event
        orderResults.push({ order, itemsCount: orderItemsData.length });
      }

      const paymentReference = `PAY-${Date.now()}`;
      await tx.payment.create({
        data: {
          tenantId: dto.vendors[0].tenantId,
          type: PaymentType.ORDER,
          provider: dto.paymentProvider as any,
          providerTransactionId: paymentReference,
          amount: globalTotalAmount,
          status: PaymentStatus.PENDING,
          metadata: {
            orderIds: orderResults.map((r) => r.order.id),
            reference: paymentReference,
          },
        },
      });

      return {
        customer,
        orderResults,
        paymentReference,
        globalTotalAmount,
        currency: dto.currency,
        paymentProvider: dto.paymentProvider,
      };
    });

    /**
     * TOP 1% LOGIC: Hybrid Fulfillment Check
     * REDIRECT providers (PayPal/Stripe) are initiated synchronously.
     * PUSH providers (Mpesa) remain in the background queue via the event.
     */

    const providerStrategy = this.paymentRegistry.get(result.paymentProvider as any);
    let checkoutUrl: string | undefined;

    if (providerStrategy.getFulfillmentType() === PaymentFulfillmentType.REDIRECT) {
      // Initiate immediately to get the PayPal/Stripe URL for the frontend
      const initResult = await this.tenantContext.run(result.orderResults[0].order.tenantId, async () => {
        return await this.paymentService.initiate({
          provider: result.paymentProvider as any,
          amount: result.globalTotalAmount,
          currency: result.currency,
          reference: result.paymentReference,
          phone: result.customer.phone,
          description: `Marketplace Order: ${result.orderResults.length} stores`,
          metadata: { orderIds: result.orderResults.map(r => r.order.id) }
        });
      });
      
      checkoutUrl = initResult.checkoutUrl;
    }

    // A. Global Event: One Receipt for the Customer
    const checkoutEvent: CheckoutCompletedEvent = {
      orderIds: result.orderResults.map((r) => r.order.id),
      paymentReference: result.paymentReference,
      paymentProvider: result.paymentProvider as any,
      customerId: result.customer.id,
      customerEmail: result.customer.email,
      customerPhone: result.customer.phone,
      totalAmount: result.globalTotalAmount,
      currency: result.currency,
      tenantIds: result.orderResults.map((r) => r.order.tenantId),
    };
    this.eventEmitter.emit(ORDER_EVENTS.CHECKOUT_COMPLETED, checkoutEvent);

    // B. Individual Events: Notify each Artisan/Merchant
    for (const res of result.orderResults) {
      const orderEvent: OrderCreatedEvent = {
        orderId: res.order.id,
        orderNumber: res.order.orderNumber,
        tenantId: res.order.tenantId,
        customerId: result.customer.id,
        totalAmount: Number(res.order.totalAmount),
        currency: res.order.currency,
        itemsCount: res.itemsCount,
      };
      this.eventEmitter.emit(ORDER_EVENTS.ORDER_CREATED, orderEvent);
    }

    return {
      orderIds: checkoutEvent.orderIds,
      paymentReference: checkoutEvent.paymentReference,
      checkoutUrl,
    };
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
