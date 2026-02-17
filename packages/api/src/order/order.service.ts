import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly tenantContext: TenantContextService,
  ) {}

  // Create a new order
  async create(dto: CreateOrderDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    // Generate a unique order number (e.g., ORD-xxxx)
    const orderNumber = `ORD-${Date.now()}`;

    return this.orderRepo.create({
      tenantId,
      orderNumber,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      currency: dto.currency ?? 'KES',
      shippingAddress: { ...dto.shippingAddress },
      billingAddress: { ...dto.billingAddress },
      customerId: dto.customerId,
      // notes: dto.notes,
      items: {
        create: dto.items.map((item) => ({
          productId: item.productId,
          // variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: 0, // calculate dynamically
          productName: 'Placeholder Name', // fetch from Product table if needed
          tenantId,
        })),
      },
      totalAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
    });
  }

  // List all orders with pagination
  async findAll(page: number = 1, limit: number = 10) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.orderRepo.list({ tenantId, skip, take: limit }),
      this.orderRepo.count(tenantId),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // Find order by ID
  async findOne(id: string) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const order = await this.orderRepo.findById(id, tenantId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Find all orders for a customer
  async findByCustomer(customerId: string) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    return this.orderRepo.findByCustomer(customerId, tenantId);
  }

  // Update order (e.g., status, addresses, notes)
  async update(id: string, dto: UpdateOrderDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    await this.findOne(id); // ensure order exists

    // Convert addresses to plain objects for Prisma JSON
    const shippingAddress = dto.shippingAddress
      ? { ...dto.shippingAddress }
      : undefined;
    const billingAddress = dto.billingAddress
      ? { ...dto.billingAddress }
      : undefined;

    // Prepare the data object for Prisma update
    const data: any = {
      ...dto,
      shippingAddress,
      billingAddress,
    };

    // Remove 'items' from update because nested creates require extra handling
    delete data.items;

    return this.orderRepo.update(id, tenantId, data);
  }

  // Delete order
  async remove(id: string) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    await this.findOne(id); // ensure it exists
    return this.orderRepo.delete(id, tenantId);
  }

  // Add items to an existing order
  async addItems(orderId: string, items: CreateOrderDto['items']) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    await this.findOne(orderId);
    return this.orderRepo.addItems(
      orderId,
      tenantId,
      items.map((item) => ({
        tenantId,
        orderId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: 0, // calculate dynamically if needed
        productName: "Placeholder Name",
      })),
    );
  }
}
