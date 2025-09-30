import React from "react";
import { ShippingMethodCard } from "./ShippingMethodCard";
import { Truck, PackageCheck, Rocket } from "lucide-react";

export function ShippingMethodsTab() {
  return (
    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
      <ShippingMethodCard
        icon={<Truck className="w-8 h-8 text-blue-600" />}
        title="Standard Shipping"
        deliveryTime="5-7 business days"
        cost="FREE on orders over 50 or 5.99"
        description="Reliable delivery for everyday orders"
        bestFor="Regular purchases, non-urgent items"
        color="#2563eb"
      />
      <ShippingMethodCard
        icon={<PackageCheck className="w-8 h-8 text-orange-600" />}
        title="Express Shipping"
        deliveryTime="2-3 business days"
        cost="9.99"
        description="Faster delivery when you need it sooner"
        bestFor="Gifts, time-sensitive items"
        color="#ea580c"
      />
      <ShippingMethodCard
        icon={<Rocket className="w-8 h-8 text-red-600" />}
        title="Overnight Shipping"
        deliveryTime="1 business day"
        cost="19.99"
        description="Next-day delivery for urgent orders"
        bestFor="Last-minute gifts, urgent needs"
        color="#dc2626"
        cutoff="Order by 2 PM for next-day delivery"
      />
    </div>
  );
}
