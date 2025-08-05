// At the bottom of your customers.dto.ts or in a new validation file

import { z } from 'zod';

// Zod schema for validating the customer form
export const customerFormSchema = z.object({
  id: z.string().optional(), // Optional, present when editing
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
});

// Infer the TypeScript type from the Zod schema
export type CustomerFormData = z.infer<typeof customerFormSchema>;