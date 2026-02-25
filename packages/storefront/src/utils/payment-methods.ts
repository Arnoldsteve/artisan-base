import { PaymentMethod } from "@/types/checkout";

export const paymentMethods: PaymentMethod[] = [
  {
    id: "credit_card",
    type: "credit_card",
    name: "Credit Card",
    icon: "credit-card",
    code: "CC",
    provider: "STRIPE", 
  },
  {
    id: "mpesa",
    type: "mobile_money",
    name: "M-Pesa",
    icon: "smartphone",
    code: "MP",
    provider: "MPESA", 
  },
  {
    id: "paypal",
    type: "paypal",
    name: "PayPal",
    icon: "paypal",
    code: "PP",
    provider: "PAYPAL", 
  },
];