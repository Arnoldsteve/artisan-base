"use client";

import React from "react";
import type { JSX } from "react";
import { Truck, PackageCheck, Rocket } from "lucide-react";
import { ShippingMethodCard } from "./ShippingMethodCard";
import { shippingOptions } from "@/lib/shipping-options";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Helper to add business days ---
function addBusinessDays(date: Date, days: number) {
  const result = new Date(date);
  while (days > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) days--; // skip weekends
  }
  return result;
}

// --- Helper to format dates ---
function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// --- Calculate date ranges for each method ---
function getDeliveryRange(optionId: string) {
  const today = new Date();
  switch (optionId) {
    case "standard":
      const start = addBusinessDays(today, 5);
      const end = addBusinessDays(today, 7);
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    case "express":
      return `${formatShortDate(addBusinessDays(today, 2))} - ${formatShortDate(
        addBusinessDays(today, 3)
      )}`;
    case "overnight":
      return `${formatShortDate(addBusinessDays(today, 1))}`;
    default:
      return "N/A";
  }
}

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

export function ShippingInfoTab() {
  const today = new Date();

  return (
    <div className="space-y-10">
      {/* SECTION 1: Overview */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {shippingOptions.map((option) => (
            <ShippingMethodCard
              key={option.id}
              icon={ICONS[option.id]}
              title={option.name}
              deliveryTime={option.estimatedDays}
              cost={option.costLabel}
              description={option.description}
              bestFor={option.bestFor}
              color={COLORS[option.id]}
              cutoff={option.cutoff || undefined}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: Summary Table */}
      <section>
        <h3 className="text-lg font-semibold mb-2">
          Shipping Cost & Delivery Summary
        </h3>
        <div className="overflow-x-auto rounded-sm shadow-none bg-[#fff] p-4">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Delivery Time</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Best For</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>{option.name}</TableCell>
                  <TableCell>{option.estimatedDays}</TableCell>
                  <TableCell>{option.costLabel}</TableCell>
                  <TableCell>{option.bestFor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* SECTION 3: Estimated Delivery Calendar */}
      <section>
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              Estimated Delivery Calendar
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Current date display */}
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-4">
              <span>
                Today is{" "}
                <span className="font-semibold text-gray-700">
                  {today.toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>

            {/* Dynamic delivery estimates */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Standard
                </span>
                <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
                  {getDeliveryRange("standard")}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Express
                </span>
                <span className="bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
                  {getDeliveryRange("express")}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Overnight
                </span>
                <span className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs font-semibold">
                  {getDeliveryRange("overnight")}
                </span>
              </div>
            </div>

            {/* Notice text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                <span className="italic text-gray-400">
                  *Delivery dates are estimates and may vary due to holidays or
                  weather.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
