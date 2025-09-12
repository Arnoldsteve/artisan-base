import { ShippingOption } from "../types/shipping";

export const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 600, 
    estimatedDays: "5-7 business days",
    description: "Standard ground shipping",
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 1300, 
    estimatedDays: "2-3 business days",
    description: "Expedited shipping",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    price: 2500, 
    estimatedDays: "1 business day",
    description: "Next day delivery",
  },
];
