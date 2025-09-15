import { z } from "zod";

// Luhn algorithm for card validation
const luhnCheck = (num: string) => {
  let sum = 0;
  let shouldDouble = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const paymentSchema = z
  .object({
    method: z.string().min(1, "Payment method is required"),

    card: z
      .object({
        number: z
          .string()
          .trim()
          .min(13, "Card number too short")
          .max(19, "Card number too long")
          .transform((val) => val.replace(/\s+/g, "")) // strip spaces
          .refine((val) => /^\d+$/.test(val), {
            message: "Card number must contain only digits",
          })
          .refine((val) => luhnCheck(val), {
            message: "Invalid card number",
          }),

        expiry: z
          .string()
          .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY")
          .refine((val) => {
            const [mm, yy] = val.split("/").map(Number);
            const now = new Date();
            // Last day of expiry month
            const expiryDate = new Date(2000 + yy, mm, 0);
            return expiryDate >= now;
          }, "Card has expired"),

        cvc: z
          .string()
          .regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),

        name: z
          .string()
          .trim()
          .min(2, "Name is required")
          .regex(/^[a-zA-Z\s'-]+$/, "Name must contain only letters"),
      })
      .optional(),

    mpesaPhone: z
      .string()
      .trim()
      .regex(/^(?:254|\+254|0)?7\d{8}$/, "Invalid M-Pesa phone number")
      .optional(),

    paypal: z
      .object({
        email: z.string().email("Invalid PayPal email address"),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.method === "credit_card") {
        return data.card !== undefined;
      }
      if (data.method === "mpesa") {
        return !!data.mpesaPhone;
      }
      if (data.method === "paypal") {
        return data.paypal?.email !== undefined;
      }
      return true;
    },
    {
      message: "Payment details are required",
      path: ["method"],
    }
  );

export type PaymentSchema = z.infer<typeof paymentSchema>;