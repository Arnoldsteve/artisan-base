import { PaymentMethod } from "@/types/checkout";

/**
 * SOLID Principle: Single Source of Truth
 * Every frontend method must map to a valid Backend PaymentProvider Enum.
 */
export const paymentMethods: PaymentMethod[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: "/icons/mpesa.svg",
    description: "Pay instantly via STK Push",
    provider: "MPESA", // ✅ Required for .toUpperCase()
  },
  {
    id: "credit_card",
    name: "Credit/Debit Card",
    icon: "/icons/card.svg",
    description: "Secure payment via Stripe",
    provider: "STRIPE", // ✅ Required for .toUpperCase()
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "/icons/paypal.svg",
    description: "Pay with your PayPal account",
    provider: "PAYPAL", // ✅ Required for .toUpperCase()
  },
];