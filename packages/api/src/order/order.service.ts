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
   */
  async createMarketplaceOrder(dto: CheckoutPayloadDto) {
    const productIds = dto.vendors.flatMap(v => v.items.map(i => i.productId));
    const dbProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Step A: Upsert Customer
        const customer = await tx.customer.upsert({
          where: { tenantId_email: { tenantId: dto.vendors[0].tenantId, email: dto.customer.email } },
          update: { phone: dto.customer.phone },
          create: {
            email: dto.customer.email,
            firstName: dto.customer.firstName,
            lastName: dto.customer.lastName,
            phone: dto.customer.phone,
            tenantId: dto.vendors[0].tenantId,
          }
        });

        const orderIds: string[] = [];

        // Step B: Multi-Vendor loop
        for (const vendor of dto.vendors) {
          let vendorSubtotal = 0;

          const orderItemsData = vendor.items.map(item => {
            const dbProd = dbProducts.find(p => p.id === item.productId);
            if (!dbProd) throw new BadRequestException(`Product ${item.productId} not found`);
            
            const lineTotal = Number(dbProd.price) * item.quantity;
            vendorSubtotal += lineTotal;

            return {
              productId: dbProd.id,
              productName: dbProd.name,
              unitPrice: dbProd.price,
              quantity: item.quantity,
              tenantId: vendor.tenantId,
            };
          });

          const order = await tx.order.create({
            data: {
              tenantId: vendor.tenantId,
              orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              status: OrderStatus.PENDING,
              paymentStatus: PaymentStatus.PENDING,
              currency: dto.currency,
              totalAmount: vendorSubtotal,
              shippingAddress: dto.shippingAddress as any,
              // FIX for Error 1: Use shippingAddress as billing if billing is missing in DTO
              billingAddress: (dto as any).billingAddress || dto.shippingAddress as any,
              customerId: customer.id,
              items: { create: orderItemsData }
            }
          });

          orderIds.push(order.id);
        }

        const paymentReference = `PAY-${Date.now()}`;
        await tx.payment.create({
          data: {
            tenantId: dto.vendors[0].tenantId,
            type: PaymentType.ORDER,
            provider: dto.paymentProvider as any,
            providerTransactionId: paymentReference,
            amount: 0, 
            status: PaymentStatus.PENDING,
            metadata: { orderIds }
          }
        });

        return { orderIds, paymentReference };
      });
    } catch (error) {
      throw new InternalServerErrorException('Checkout failed');
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