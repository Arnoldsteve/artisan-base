import { z } from 'zod';

/**
 * Zod schema for contact form email props
 * This validates the data at runtime before sending
 */
export const ContactFormEmailSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long'),
  
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message is too long'),
  
  timestamp: z.string().optional(),
  
  source: z.string().optional(),
});

/**
 * TypeScript type derived from the schema
 */
export type ContactFormEmailProps = z.infer<typeof ContactFormEmailSchema>;