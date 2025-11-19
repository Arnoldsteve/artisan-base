import { EmailTemplateConfig } from '../../../interfaces/email-template.interface';

/**
 * Configuration for the order confirmation email template
 */
export const orderConfirmationEmailConfig: EmailTemplateConfig = {
  id: 'order-confirmation',
  name: 'Order Confirmation',
  category: 'transactional',
  defaultSubject: 'Your Order Confirmation (#{{orderNumber}})',
  defaultFrom: 'Artisan Base <onboarding@resend.dev>',
  defaultTo: '{{email}}', // customer email
  defaultReplyTo: 'support@artisan-base.com',
  priority: 'high',
};
