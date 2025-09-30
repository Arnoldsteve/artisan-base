"use client";

import React, { useState } from "react";
import Image from "next/image";
import { mockOrders } from "./mock-orders";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardContent,
} from "@repo/ui/components/ui/card";
import { formatMoney } from "@/lib/money";

export function Step2ItemSelect({
  selectedOrderId,
  onNext,
  onBack,
}: {
  selectedOrderId: string;
  onNext: (selectedItems: any[]) => void;
  onBack: () => void;
}) {
  const order = mockOrders.find((o) => o.id === selectedOrderId);
  const [selectedItems, setSelectedItems] = useState<{
    [itemId: string]: number;
  }>({});

  if (!order) return <div className="text-red-500">Order not found.</div>;

  const handleCheckbox = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked
        ? { ...prev, [itemId]: 1 }
        : Object.fromEntries(Object.entries(prev).filter(([id]) => id !== itemId))
    );
  };

  const handleQuantity = (itemId: string, qty: number) => {
    setSelectedItems((prev) => ({ ...prev, [itemId]: qty }));
  };

  
  const defaultImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center";


  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-xl font-bold">Select Items to Return</h2>

      {/* Order Header */}
      <div className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold">Order:</span> {order.id}
          <span className="ml-2 text-sm text-gray-500">{order.date}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {order.items.map((item) => (
          <Card
            key={item.id}
            className="border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <Checkbox
                  checked={!!selectedItems[item.id]}
                  onCheckedChange={(checked) =>
                    handleCheckbox(item.id, !!checked)
                  }
                  disabled={!item.eligible}
                  aria-label={`Select ${item.name}`}
                />

                {/* Item Image */}
                <Image
                  src={defaultImage}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md border"
                />

                {/* Item Info */}
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    Variant: {item.variant}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatMoney(item.price)}
                  </div>
                  <div
                    className={`text-xs mt-1 font-medium ${
                      item.eligible ? "text-green-700" : "text-red-500"
                    }`}
                  >
                    {item.eligible
                      ? "Eligible for return"
                      : "Return window expired"}
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              {item.eligible && selectedItems[item.id] && (
                <div className="flex items-center gap-2 mt-3">
                  <Label
                    htmlFor={`qty-${item.id}`}
                    className="text-xs font-medium text-gray-600"
                  >
                    Qty:
                  </Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min={1}
                    max={3}
                    value={selectedItems[item.id]}
                    onChange={(e) =>
                      handleQuantity(
                        item.id,
                        Math.max(1, Math.min(3, Number(e.target.value)))
                      )
                    }
                    className="w-16 text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button
          onClick={() =>
            onNext(order.items.filter((item) => selectedItems[item.id]))
          }
          disabled={Object.keys(selectedItems).length === 0}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
