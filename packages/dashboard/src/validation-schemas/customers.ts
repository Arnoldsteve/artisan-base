import { z } from 'zod';

export const customerFormSchema = z.object({
  id: z.string().optional(), 
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;