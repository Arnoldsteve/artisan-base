import React from "react";
import { ShippingMethodCard } from "./ShippingMethodCard";

export function DeliveryTimesTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Delivery Timeframes</h3>
      <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-8">
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
      <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
        <h4 className="font-semibold mb-2">Estimated Delivery Calendar</h4>
        <div className="flex gap-4 items-center mb-2">
          <span className="text-sm text-gray-500">
            Today is <span className="font-semibold">July 10, 2025</span>
          </span>
          <span className="ml-auto text-xs text-gray-400">
            Order within <span className="font-semibold">3h 45m</span> for
            same-day processing
          </span>
        </div>
        <div className="flex gap-4 justify-between mt-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Standard</span>
            <span className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold">
              Jul 17-21
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Express</span>
            <span className="bg-orange-100 text-orange-700 rounded px-2 py-1 text-xs font-semibold">
              Jul 12-14
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Overnight</span>
            <span className="bg-red-100 text-red-700 rounded px-2 py-1 text-xs font-semibold">
              Jul 11
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          * Delivery dates are estimates and may vary due to holidays or
          weather.
        </div>
      </div>
    </div>
  );
}
