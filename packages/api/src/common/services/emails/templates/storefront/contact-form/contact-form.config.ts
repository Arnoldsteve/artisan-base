import { EmailTemplateConfig } from '../../../interfaces/email-template.interface';

/**
 * Configuration for the contact form email template
 */
export const contactFormEmailConfig: EmailTemplateConfig = {
  id: 'contact-form',
  name: 'Contact Form Submission',
  category: 'transactional',
  defaultSubject: 'New Contact Form Submission: {{subject}}',
  defaultFrom: 'Artisan Base <noreply@artisan-base.com>',
  defaultTo: 'support@artisan-base.com', // TODO: Replace with your actual support email
  defaultReplyTo: '{{email}}', // Will use the sender's email
  priority: 'high',
};