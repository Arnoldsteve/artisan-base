import { EmailTemplateConfig } from '../../../interfaces/email-template.interface';

/**
 * Configuration for the contact form email template
 */
export const contactFormEmailConfig: EmailTemplateConfig = {
  id: 'contact-form',
  name: 'Contact Form Submission',
  category: 'transactional',
  defaultSubject: 'New Contact Form Submission: {{subject}}',
  defaultFrom: 'Artisan Base <onboarding@resend.dev>',
  defaultTo: 'stevearnold9e@gmail.com',  
  defaultReplyTo: '{{email}}', 
  priority: 'high',
};