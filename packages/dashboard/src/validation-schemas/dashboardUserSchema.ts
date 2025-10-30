import { z } from "zod";
import { DashboardUserRole } from "@/types/roles";

export const DashboardUserSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(2, { message: "firstName must be at least 2 characters." })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: "lastName must be at least 2 characters." })
    .optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(),
  role: z.nativeEnum(DashboardUserRole, {
    errorMap: () => ({ message: "Please select a role." }),
  }),
  // isActive: z.boolean(),
});

export type DashboardUserFormData = z.infer<typeof DashboardUserSchema>;
