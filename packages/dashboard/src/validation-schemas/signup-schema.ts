import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .transform((value) => {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }),

  lastName: z
    .string()
    .transform((value) => {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }),

  email: z.string().email("Enter a valid email"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
