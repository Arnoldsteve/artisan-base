import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { render } from '@react-email/render';
import { MailService } from '../common/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { 
  CheckoutCompletedEvent, 
  OrderCreatedEvent 
} from '../order/events/order.events';

// --- Import Templates ---
import { BuyerReceiptEmail } from './templates/buyer-receipt.email';
import { MerchantOrderAlertEmail } from './templates/merchant-order-alert.email';
import PaymentConfirmationEmail from './templates/payment-confirmation.email';
import { PaymentUpdatedEvent } from '@/payment/events/payment.events';

/**
 * SOLID Principle: Single Responsibility
 * This service orchestrates data fetching and template rendering.
 * It is the 'content engine' for the platform's communication.
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * TOP 1% LOGIC: Multi-Vendor Receipt Orchestration
   * millions of users: Aggregates multiple isolated orders into one unified 
   * React Email component to provide a professional marketplace experience.
   */
  async sendCustomerReceipt(payload: CheckoutCompletedEvent) {
    this.logger.log(`Rendering consolidated receipt for: ${payload.customerEmail}`);

    // 1. Fetch full details for the consolidated view
    const orders = await this.prisma.order.findMany({
      where: { id: { in: payload.orderIds } },
      include: { 
        items: true,
        tenant: { select: { name: true } }
      }
    });

    // 2. Map data to the template's expected structure
    const vendorGroups = orders.map(order => ({
      merchantName: order.tenant.name,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      }))
    }));

    // 3. Render React component to static HTML string
    const html = await render(
      BuyerReceiptEmail({
        customerName: payload.customerEmail.split('@')[0], // Fallback if name missing
        paymentReference: payload.paymentReference,
        totalAmount: payload.totalAmount.toLocaleString(),
        currency: payload.currency,
        vendors: vendorGroups,
      })
    );

    // 4. Delegate delivery to the infrastructure layer
    return this.mailService.sendMail({
      to: payload.customerEmail,
      subject: `Receipt for your Order [${payload.paymentReference}]`,
      html,
    });
  }

  /**
   * millions of users: Notifies the specific store owner of a new sale.
   */
  async sendMerchantOrderAlert(payload: OrderCreatedEvent) {
    // 1. Resolve the human owner of the tenant
    const merchant = await this.prisma.tenantMember.findFirst({
      where: { tenantId: payload.tenantId, role: 'OWNER' },
      include: { user: true }
    });

    if (!merchant) {
      this.logger.warn(`No owner found to notify for tenant: ${payload.tenantId}`);
      return;
    }

    // 2. Render the merchant-specific template
    const html = await render(
      MerchantOrderAlertEmail({
        merchantName: merchant.user.firstName || 'Artisan',
        orderNumber: payload.orderNumber,
        totalAmount: payload.totalAmount.toLocaleString(),
        currency: payload.currency,
        itemsCount: payload.itemsCount,
        orderId: payload.orderId,
      })
    );

    return this.mailService.sendMail({
      to: merchant.user.email,
      subject: `New Sale! Order #${payload.orderNumber}`,
      html,
    });
  }

  async sendPaymentConfirmation(event: PaymentUpdatedEvent) {
  // 1. Fetch payment + orders to get customer email
  const payment = await this.prisma.payment.findUnique({
    where: { id: event.paymentId },
  });

  if (!payment) {
    this.logger.warn(`Payment not found for confirmation: ${event.paymentId}`);
    return;
  }

  const orderIds: string[] = (payment.metadata as any)?.orderIds || [];
  const orders = await this.prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: { customer: true },
  });

  const customer = orders[0]?.customer;
  if (!customer) {
    this.logger.warn(`No customer found for payment: ${event.paymentId}`);
    return;
  }

  const mpesaReceiptNumber = (event.rawPayload as any)?.Body?.stkCallback
    ?.CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')
    ?.Value ?? 'N/A';

  const html = await render(
    PaymentConfirmationEmail({
      customerName: customer.firstName || customer.email.split('@')[0],
      paymentReference: (payment.metadata as any)?.reference ?? event.paymentId,
      mpesaReceiptNumber,
      amount: Number(payment.amount).toLocaleString(),
      currency: 'KES',
    })
  );

  return this.mailService.sendMail({
    to: customer.email,
    subject: `Payment Confirmed ✓ [${(payment.metadata as any)?.reference}]`,
    html,
  });
}
}