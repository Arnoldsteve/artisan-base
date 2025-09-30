"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Label } from "@repo/ui/components/ui/label";

const shippingOptions = [
  {
    id: "free",
    label: "Free return shipping",
    description: "Eligible for free return shipping.",
  },
  {
    id: "prepaid",
    label: "Prepaid return label",
    description: "$5.00 will be deducted from your refund.",
  },
  {
    id: "store",
    label: "Drop off at store",
    description: "Return at any of our retail locations.",
  },
];

const refundOptions = [
  { id: "original", label: "Original payment method" },
  { id: "store-credit", label: "Store credit (get 5% bonus)" },
  { id: "other", label: "Different payment method" },
];

export function Step4ReturnMethod({
  onNext,
  onBack,
}: {
  onNext: (method: any) => void;
  onBack: () => void;
}) {
  const [selectedShipping, setSelectedShipping] = useState<string>(
    shippingOptions[0].id
  );
  const [selectedRefund, setSelectedRefund] = useState<string>(
    refundOptions[0].id
  );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Return Method</h2>

      {/* Shipping Options */}
      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        <div>
          <h3 className="font-semibold mb-3">Return Shipping Options</h3>
          <RadioGroup
            value={selectedShipping}
            onValueChange={setSelectedShipping}
            className="space-y-3"
          >
            {shippingOptions.map((opt) => (
              <Card
                key={opt.id}
                className="cursor-pointer transition hover:shadow-sm"
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <RadioGroupItem value={opt.id} id={opt.id} />
                  <div className="flex-1">
                    <Label htmlFor={opt.id} className="font-medium">
                      {opt.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        {/* Refund Options */}
        <div>
          <h3 className="font-semibold mb-3">Refund Method</h3>
          <RadioGroup
            value={selectedRefund}
            onValueChange={setSelectedRefund}
            className="space-y-3"
          >
            {refundOptions.map((opt) => (
              <Card
                key={opt.id}
                className="cursor-pointer transition hover:shadow-sm"
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <RadioGroupItem value={opt.id} id={opt.id} />
                  <Label htmlFor={opt.id} className="font-medium">
                    {opt.label}
                  </Label>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button
          onClick={() =>
            onNext({ shipping: selectedShipping, refund: selectedRefund })
          }
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
