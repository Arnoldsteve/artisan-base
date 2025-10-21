import { FREE_SHIPPING_THRESHOLD } from "@/constants/shipping";
import { formatMoney } from "./money";

export const shippingOptions = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 600,
    estimatedDays: "5-7 business days",
    description: "Standard ground shipping",
    bestFor: "Regular purchases, non-urgent items",
    cutoff: null,
    get costLabel() {
      return `FREE on orders over ${formatMoney(FREE_SHIPPING_THRESHOLD)} or ${formatMoney(this.price)}`;
    },
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 1300,
    estimatedDays: "2-3 business days",
    description: "Expedited shipping",
    bestFor: "Gifts, time-sensitive items",
    cutoff: null,
    get costLabel() {
      return formatMoney(this.price);
    },
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    price: 2500,
    estimatedDays: "1 business day",
    description: "Next day delivery",
    bestFor: "Last-minute gifts, urgent needs",
    cutoff: "Order by 2 PM for next-day delivery",
    get costLabel() {
      return formatMoney(this.price);
    },
  },
];
