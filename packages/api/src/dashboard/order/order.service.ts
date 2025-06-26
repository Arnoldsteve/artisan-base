import { BadRequestException, Injectable, Logger, NotFoundException, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
// import { paginate } from 'src/common/helpers/paginate.helper';
// import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateManualOrderDto, UpdateOrderDto, UpdatePaymentStatusDto } from './dto'; 
import { Decimal } from 'decimal.js'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async createManualOrder(dto: CreateManualOrderDto) {
    const { items, customer, shippingAddress, billingAddress, notes, shippingAmount } = dto;

    return this.tenantPrisma.$transaction(async (tx) => {
      // 1. Find or create the customer
      const customerRecord = await tx.customer.upsert({
        where: { email: customer.email },
        update: { firstName: customer.firstName, lastName: customer.lastName },
        create: { email: customer.email, firstName: customer.firstName, lastName: customer.lastName },
      });

      // 2. Fetch all products/variants at once for efficiency
      const productIds = items.map(i => i.productId);
      const variantIds = items.map(i => i.variantId).filter((id): id is string => typeof id === 'string');

      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      const variants = await tx.productVariant.findMany({ where: { id: { in: variantIds } } });

      let subtotal = new Decimal(0);
      const orderItemsData: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
        unitPrice: Decimal;
        productName: string;
        variantName: string | null;
        sku: string | null;
        image: any;
      }> = [];

      // 3. Validate items and calculate subtotal
      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new NotFoundException(`Product with ID ${item.productId} not found.`);

        let stock = product.inventoryQuantity;
        let price = product.price;
        let variantName: string | null = null;
        let variantSku: string | null = null;

        if (item.variantId) {
          const variant = variants.find(v => v.id === item.variantId);
          if (!variant) throw new NotFoundException(`Variant with ID ${item.variantId} not found.`);
          if (variant.productId !== product.id) throw new BadRequestException(`Variant ${variant.id} does not belong to product ${product.id}.`);
          
          stock = variant.inventoryQuantity;
          price = variant.price ?? product.price; // Use variant price if available, else fallback to product price
          variantName = variant.name;
          variantSku = variant.sku;
        }

        if (stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${product.name} ${variantName ? `(${variantName})` : ''}.`);
        }
        
        const lineItemTotal = new Decimal(price).mul(item.quantity);
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

      // 4. Calculate final totals
      const finalShipping = new Decimal(shippingAmount ?? 0);
      const finalTax = new Decimal(0); // For simplicity, tax is 0. Add your tax logic here.
      const totalAmount = subtotal.plus(finalShipping).plus(finalTax);
      
      // 5. Generate a unique order number
      const lastOrder = await tx.order.findFirst({ orderBy: { orderSequence: 'desc' } });
      const newSequence = (lastOrder?.orderSequence ?? 0) + 1;
      const orderNumber = `ORD-${String(newSequence).padStart(6, '0')}`;
      
      // 6. Create the order
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
      
      // 7. Decrement stock (critically, do this last)
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

      return order;
    });
  }
  
  async findAll(paginationQuery: PaginationQueryDto) {
    Logger.log(`Fetching orders with pagination: ${JSON.stringify(paginationQuery)}`, OrderService.name);
    return paginate(
      this.tenantPrisma.order,
      {
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      },
      {
        orderBy: { orderSequence: 'desc' }, 
        include: {
          // Include a count of items to show on the list view
          _count: {
            select: { items: true },
          },
        },
      },
    );
  }

  async findOne(id: string) {
    const order = await this.tenantPrisma.order.findUnique({
      where: { id },
      include: {
        // When fetching a single order, include all its line items
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found.`);
    }
    return order;
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id); // Ensure order exists
    return this.tenantPrisma.order.update({
      where: { id },
      data: { status: updateOrderDto.status },
    });
  }
  
  // A separate method for updating payment status
  async updatePaymentStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
      await this.findOne(id); // Ensure order exists
      return this.tenantPrisma.order.update({
          where: { id },
          data: { paymentStatus: updatePaymentStatusDto.paymentStatus }
      });
  }
}