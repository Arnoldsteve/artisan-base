import { EmailTemplate } from '../../../interfaces/email-template.interface';
import ContactFormEmailTemplate from './contact-form.template';
import { ContactFormEmailSchema, ContactFormEmailProps } from './contact-form.schema';
import { contactFormEmailConfig } from './contact-form.config';

/**
 * Complete contact form email template registration
 */
export const contactFormEmailTemplate: EmailTemplate<ContactFormEmailProps> = {
  config: contactFormEmailConfig,
  component: ContactFormEmailTemplate,
  schema: ContactFormEmailSchema,
};

// Re-export everything for convenience
export { ContactFormEmailTemplate, ContactFormEmailSchema, contactFormEmailConfig };
export type { ContactFormEmailProps };