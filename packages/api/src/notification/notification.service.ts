import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../common/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
// import { formatMoney } from '@/common/utils/money'; // Assuming this utility exists in common
import { 
  CheckoutCompletedEvent, 
  OrderCreatedEvent 
} from '../order/events/order.events';

/**
 * SOLID Principle: Single Responsibility
 * This service is responsible for the business logic of notifications.
 * It formats raw data into human-readable HTML templates.
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * TOP 1% LOGIC: Consolidated Customer Receipt
   * millions of users: Fetches data for all sub-orders in a transaction 
   * to send ONE professional email instead of multiple spammy ones.
   */
  async sendCustomerReceipt(payload: CheckoutCompletedEvent) {
    // 1. Fetch full details for all orders in this checkout
    const orders = await this.prisma.order.findMany({
      where: { id: { in: payload.orderIds } },
      include: { 
        items: true,
        tenant: { select: { name: true } }
      }
    });

    // 2. Generate the HTML Line Items (Multi-vendor aware)
    let itemsHtml = '';
    orders.forEach(order => {
      itemsHtml += `<tr style="background-color: #f8fafc;"><td colspan="2" style="padding: 8px; font-weight: bold; font-size: 12px; color: #475569;">SOLD BY: ${order.tenant.name}</td></tr>`;
      order.items.forEach(item => {
        itemsHtml += `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
              <div style="font-weight: 600;">${item.productName}</div>
              <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity}</div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">
              KES ${(parseFloat(item.unitPrice.toString()) * item.quantity).toLocaleString()}
            </td>
          </tr>
        `;
      });
    });

    // 3. Construct the full email
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px;">
        <h1 style="color: #2563eb; font-size: 24px; font-weight: 800;">ORDER CONFIRMED</h1>
        <p>Hi there,</p>
        <p>Thank you for your purchase from <strong>Artisan Base</strong>. We've notified our artisans, and they are preparing your goods.</p>
        
        <div style="background: #f1f5f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <div style="font-size: 12px; color: #64748b;">Payment Reference</div>
          <div style="font-family: monospace; font-weight: bold;">${payload.paymentReference}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 12px; background: #f8fafc; font-size: 12px;">ITEM</th>
              <th style="text-align: right; padding: 12px; background: #f8fafc; font-size: 12px;">PRICE</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <div style="font-size: 14px; color: #64748b;">Total Amount Paid</div>
          <div style="font-size: 24px; font-weight: 900; color: #2563eb;">KES ${payload.totalAmount.toLocaleString()}</div>
        </div>
      </div>
    `;

    return this.mailService.sendMail({
      to: payload.customerEmail,
      subject: `Receipt for your Artisan Base Order [${payload.paymentReference}]`,
      html,
    });
  }

  /**
   * TOP 1% LOGIC: Merchant New Order Alert
   * Notifies a specific artisan that they have money waiting in the dashboard.
   */
  async sendMerchantOrderAlert(payload: OrderCreatedEvent) {
    const merchant = await this.prisma.tenantMember.findFirst({
      where: { tenantId: payload.tenantId, role: 'OWNER' },
      include: { user: true }
    });

    if (!merchant) return;

    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>You have a new sale!</h2>
        <p>Order <strong>#${payload.orderNumber}</strong> has been placed in your store.</p>
        <p><strong>Amount:</strong> KES ${payload.totalAmount.toLocaleString()}</p>
        <p><strong>Items:</strong> ${payload.itemsCount}</p>
        <a href="https://dashboard.artisan-base.com/orders/${payload.orderId}" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Prepare for Fulfillment
        </a>
      </div>
    `;

    return this.mailService.sendMail({
      to: merchant.user.email,
      subject: `New Sale Alert: ${payload.orderNumber}`,
      html,
    });
  }
}