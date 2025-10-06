// validation-schemas/inviteMemberSchema.ts
import { z } from 'zod';
import { TenantRole } from '@/types/roles';

export const inviteMemberSchema = z.object({
  userName: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  role: z.nativeEnum(TenantRole, {
    errorMap: () => ({ message: 'Please select a role.' }),
  }),
});

export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;
