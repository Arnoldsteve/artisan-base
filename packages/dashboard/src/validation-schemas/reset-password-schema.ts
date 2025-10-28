import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string({
      required_error: "Reset token is required.",
    }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character."
      ),

    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });


  export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
