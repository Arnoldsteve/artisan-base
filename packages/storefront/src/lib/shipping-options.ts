import { ShippingOption } from "../types/shipping";

export const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 5.99,
    estimatedDays: "5-7 business days",
    description: "Standard ground shipping",
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 12.99,
    estimatedDays: "2-3 business days",
    description: "Expedited shipping",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    price: 24.99,
    estimatedDays: "1 business day",
    description: "Next day delivery",
  },
];
