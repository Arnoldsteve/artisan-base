import { z } from "zod";
import { TenantUserRole } from "@/types/roles";

/**
 * SOLID Principle: Single Responsibility
 * This schema validates the data for managing staff within a tenant.
 */
export const StaffMemberSchema = z.object({
  id: z.string().optional(), // The TenantMember ID
  
  // User Details (Nested in the UI form, but part of the staff creation)
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(50)
    .optional()
    .or(z.literal("")),
    
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(50)
    .optional()
    .or(z.literal("")),
    
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .toLowerCase()
    .trim(),

  // Role Management
  role: z.nativeEnum(TenantUserRole, {
    errorMap: () => ({ message: "Please select a valid store role." }),
  }),

  // Status Management
  isActive: z.boolean().default(true).optional(),

  /**
   * Enterprise Standard: 
   * Password is usually optional because most SaaS platforms use 
   * "Invite Links" where staff set their own passwords.
   */
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .optional()
    .or(z.literal("")),
});

export type StaffMemberFormData = z.infer<typeof StaffMemberSchema>;