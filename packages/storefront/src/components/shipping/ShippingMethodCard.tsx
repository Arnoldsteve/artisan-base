import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";

interface ShippingMethodCardProps {
  icon: React.ReactNode;
  title: string;
  deliveryTime: string;
  cost: string | number; 
  description: string;
  bestFor: string;
  color: string;
  cutoff?: string;
}

export function ShippingMethodCard({
  icon,
  title,
  deliveryTime,
  cost,
  description,
  bestFor,
  color,
  cutoff,
}: ShippingMethodCardProps) {
  // Check if cost is numeric
  const parsedCost = typeof cost === "number" ? cost : Number(cost);

  const renderCost = () => {
    if (typeof cost === "number") {
      return formatMoney(cost);
    }

    if (!isNaN(parsedCost)) {
      return formatMoney(parsedCost);
    }

    // fallback: just print string
    return (
      <span className="text-green-600 font-semibold">
        {cost}
      </span>
    );
  };

  return (
    <Card className="w-[300px] hover:shadow-xl transition-transform hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color }}>
            {icon}
          </span>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="font-semibold text-base mb-1" style={{ color }}>
          {deliveryTime}
        </div>

        <div className="text-sm font-medium mb-1">{renderCost()}</div>

        <div className="text-sm text-gray-600 mb-1">{description}</div>
        <div className="text-xs text-gray-500 mb-1">
          Best for: {bestFor}
        </div>
        {cutoff && (
          <div className="text-xs text-red-600 font-semibold">{cutoff}</div>
        )}
      </CardContent>
    </Card>
  );
}
