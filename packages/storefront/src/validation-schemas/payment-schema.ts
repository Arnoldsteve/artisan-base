import { z } from "zod";

/**
 * TOP 1% ARCHITECTURE: Discriminated Union Schema
 * This ensures that validation is contextual. We only demand data 
 * relevant to the selected payment method.
 */
export const paymentSchema = z.discriminatedUnion("method", [
  // 1. M-Pesa Branch
  z.object({
    method: z.literal("mpesa"),
    mpesaPhone: z
      .string()
      .min(9, "Phone number is too short")
      .regex(/^(?:254|\+254|0)?7\d{8}$/, "Invalid M-Pesa format"),
  }),

  // 2. Credit Card Branch
  z.object({
    method: z.literal("credit_card"),
    cardName: z.string().min(2, "Name on card is required"),
    cardNumber: z.string().min(13, "Invalid card number"),
    // You can add expiry/cvc here if collecting them
  }),

  // 3. PayPal Branch (Marketplace Standard: No data needed for redirect)
  z.object({
    method: z.literal("paypal"),
  }),
]);

export type PaymentSchema = z.infer<typeof paymentSchema>;