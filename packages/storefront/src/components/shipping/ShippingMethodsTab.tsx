import React from "react";
import type { JSX } from "react";
import { ShippingMethodCard } from "./ShippingMethodCard";
import { Truck, PackageCheck, Rocket } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { shippingOptions } from "@/lib/shipping-options";

const ICONS: Record<string, JSX.Element> = {
  standard: <Truck className="w-8 h-8 text-blue-600" />,
  express: <PackageCheck className="w-8 h-8 text-orange-600" />,
  overnight: <Rocket className="w-8 h-8 text-red-600" />,
};

const COLORS: Record<string, string> = {
  standard: "#2563eb",
  express: "#ea580c",
  overnight: "#dc2626",
};

export function ShippingMethodsTab() {
  return (
    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
      {shippingOptions.map((option) => {
        const isStandard = option.id === "standard";

        // Build cost text — use constant for free shipping rule
        const costText = isStandard
          ? `FREE on orders over ${formatMoney(FREE_SHIPPING_THRESHOLD, "KES")} or ${formatMoney(option.price, "KES")}`
          : formatMoney(option.price, "KES");

        return (
          <ShippingMethodCard
            key={option.id}
            icon={ICONS[option.id]}
            title={option.name}
            deliveryTime={option.estimatedDays}
            cost={costText}
            description={option.description}
            bestFor={
              isStandard
                ? "Regular purchases, non-urgent items"
                : option.id === "express"
                ? "Gifts, time-sensitive items"
                : "Last-minute gifts, urgent needs"
            }
            color={COLORS[option.id]}
            cutoff={option.id === "overnight" ? "Order by 2 PM for next-day delivery" : undefined}
          />
        );
      })}
    </div>
  );
}
