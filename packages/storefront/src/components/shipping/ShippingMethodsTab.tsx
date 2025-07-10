import React from "react";
import { ShippingMethodCard } from "./ShippingMethodCard";

export function ShippingMethodsTab() {
  return (
    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
      <ShippingMethodCard
        icon={
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
            <rect x="2" y="12" width="20" height="10" rx="3" fill="#2563eb" />
            <rect x="22" y="16" width="8" height="6" rx="2" fill="#6b7280" />
            <circle cx="8" cy="26" r="3" fill="#16a34a" />
            <circle cx="26" cy="26" r="3" fill="#16a34a" />
          </svg>
        }
        title="Standard Shipping"
        deliveryTime="5-7 business days"
        cost="FREE on orders over $50 or $5.99"
        description="Reliable delivery for everyday orders"
        bestFor="Regular purchases, non-urgent items"
        color="#2563eb"
      />
      <ShippingMethodCard
        icon={
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
            <rect x="2" y="12" width="20" height="10" rx="3" fill="#ea580c" />
            <rect x="22" y="16" width="8" height="6" rx="2" fill="#fbbf24" />
            <circle cx="8" cy="26" r="3" fill="#ea580c" />
            <circle cx="26" cy="26" r="3" fill="#ea580c" />
          </svg>
        }
        title="Express Shipping"
        deliveryTime="2-3 business days"
        cost="$9.99"
        description="Faster delivery when you need it sooner"
        bestFor="Gifts, time-sensitive items"
        color="#ea580c"
      />
      <ShippingMethodCard
        icon={
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
            <path d="M4 24l24-8-8 8 8-24-24 8 8-8z" fill="#dc2626" />
          </svg>
        }
        title="Overnight Shipping"
        deliveryTime="1 business day"
        cost="$19.99"
        description="Next-day delivery for urgent orders"
        bestFor="Last-minute gifts, urgent needs"
        color="#dc2626"
        cutoff="Order by 2 PM for next-day delivery"
      />
    </div>
  );
}
