import { EmailTemplate } from '../../../interfaces/email-template.interface';
import OrderConfirmationEmailTemplate from './order-confirmation.template';
import {
  orderConfirmationSchema,
  OrderConfirmationEmailSchema,
} from './order-confirmation.schema';
import { orderConfirmationEmailConfig } from './order-confirmation.config';

/**
 * Complete order confirmation email template registration
 */
export const orderConfirmationEmailTemplate: EmailTemplate<OrderConfirmationEmailSchema> = {
  config: orderConfirmationEmailConfig,
  component: OrderConfirmationEmailTemplate,
  schema: orderConfirmationSchema,
};

// Re-export for convenience
export {
  OrderConfirmationEmailTemplate,
  orderConfirmationSchema,
  orderConfirmationEmailConfig,
};

export type { OrderConfirmationEmailSchema };
