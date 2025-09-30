"use client";

import React from "react";
import { Truck, Rocket, Timer } from "lucide-react";
import { ShippingMethodCard } from "./ShippingMethodCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const shippingMethods = [
  {
    id: "standard",
    icon: <Truck className="w-8 h-8 text-blue-600" />,
    title: "Standard Shipping",
    deliveryTime: "5-7 business days",
    cost: "FREE on orders over 50 or 5.99",
    description: "Reliable delivery for everyday orders",
    bestFor: "Regular purchases, non-urgent items",
    color: "#2563eb",
  },
  {
    id: "express",
    icon: <Timer className="w-8 h-8 text-orange-600" />,
    title: "Express Shipping",
    deliveryTime: "2-3 business days",
    cost: "9.99",
    description: "Faster delivery when you need it sooner",
    bestFor: "Gifts, time-sensitive items",
    color: "#ea580c",
  },
  {
    id: "overnight",
    icon: <Rocket className="w-8 h-8 text-red-600" />,
    title: "Overnight Shipping",
    deliveryTime: "1 business day",
    cost: "19.99",
    description: "Next-day delivery for urgent orders",
    bestFor: "Last-minute gifts, urgent needs",
    color: "#dc2626",
    cutoff: "Order by 2 PM for next-day delivery",
  },
];

export function DeliveryTimesTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Delivery Timeframes</h3>

      {/* Shipping options */}
      <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-8">
        {shippingMethods.map((method) => (
          <ShippingMethodCard key={method.id} {...method} />
        ))}
      </div>

      {/* Delivery calendar */}
      <Card className="max-w-xl mx-auto just">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Estimated Delivery Calendar
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
            <span>
              Today is <span className="font-semibold">July 10, 2025</span>
            </span>
            <span className="ml-auto text-xs text-gray-400">
              Order within <span className="font-semibold">3h 45m</span> for
              same-day processing
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-xs text-gray-500 block mb-1">Standard</span>
              <span className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold">
                Jul 17-21
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Express</span>
              <span className="bg-orange-100 text-orange-700 rounded px-2 py-1 text-xs font-semibold">
                Jul 12-14
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">
                Overnight
              </span>
              <span className="bg-red-100 text-red-700 rounded px-2 py-1 text-xs font-semibold">
                Jul 11
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 text-center">
            * Delivery dates are estimates and may vary due to holidays or
            weather.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
