import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';
import { GetStorefrontOrdersDto } from './dto/get-storefront-orders.dto';
import { StorefrontOrderRepository } from './storefront-order.repository';
import { EmailService } from '@/common/services/emails/email.service';
import { EmailTemplateId } from '@/common/services/emails/templates';
import { formatDate } from '@/common/utils/date-fomrmat';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontOrderService {
  private readonly logger = new Logger(StorefrontOrderService.name);

  constructor(
    private readonly orderRepository: StorefrontOrderRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateStorefrontOrderDto) {
    // 1️⃣ Create the order
    const createdOrderResult = await this.orderRepository.create(dto);
    const order = createdOrderResult.order;

    // 2️⃣ Prepare email props for order-confirmation template
    const emailProps = {
      orderNumber: order.orderNumber,
      customerName: order.customer?.firstName + ' ' + order.customer?.lastName,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice), 
        image: item.image,
        sku: item.sku,
      })),
      subtotal: Number(order.subtotal), 
      taxAmount: Number(order.taxAmount), 
      shippingAmount: Number(order.shippingAmount), 
      totalAmount: Number(order.totalAmount), 
      currency: order.currency || 'KES', 
      createdAt: formatDate(order.createdAt, { includeTime: true }),
    };

    // 3️⃣ Send order confirmation email
    try {
      const emailResult = await this.emailService.send({
        templateId: EmailTemplateId.ORDER_CONFIRMATION,
        props: emailProps,
        to: dto.customer?.email || 'stevearnold9e@gmail.com', // fallback if no customer email
      });

      if (!emailResult.success) {
        this.logger.error(
          `Failed to send order confirmation email for order ${order.orderNumber}: ${emailResult.error}`,
        );
      } else {
        this.logger.log(
          `Order confirmation email sent for order ${order.orderNumber}, MessageId: ${emailResult.messageId}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `Unexpected error sending order confirmation email for order ${order.orderNumber}: ${err}`,
      );
    }

    // 4️⃣ Return order and optionally email result
    return {
      success: true,
      order,
    };
  }

  async getOrders(query: GetStorefrontOrdersDto) {
    return this.orderRepository.getOrders(query);
  }

  async getOrder(id: string, query: GetStorefrontOrdersDto) {
    return this.orderRepository.getOrder(id, query);
  }
}
