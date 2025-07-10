import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";

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
    <div>
      <h2 className="text-xl font-bold mb-4">Return Method</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Return Shipping Options</h3>
        <div className="space-y-2">
          {shippingOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 p-3 border rounded cursor-pointer"
            >
              <input
                type="radio"
                name="shippingOption"
                value={opt.id}
                checked={selectedShipping === opt.id}
                onChange={() => setSelectedShipping(opt.id)}
                className="accent-primary"
              />
              <span className="flex-1">
                <span className="font-medium">{opt.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Refund Method</h3>
        <div className="space-y-2">
          {refundOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 p-3 border rounded cursor-pointer"
            >
              <input
                type="radio"
                name="refundOption"
                value={opt.id}
                checked={selectedRefund === opt.id}
                onChange={() => setSelectedRefund(opt.id)}
                className="accent-primary"
              />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() =>
            onNext({ shipping: selectedShipping, refund: selectedRefund })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
