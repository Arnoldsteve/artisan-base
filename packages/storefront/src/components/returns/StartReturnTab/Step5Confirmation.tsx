import React from "react";
import { Button } from "@repo/ui/components/ui/button";

export function Step5Confirmation({
  selectedOrderId,
  selectedItems,
  returnDetails,
  returnMethod,
  onBack,
}: {
  selectedOrderId: string;
  selectedItems: any[];
  returnDetails: any;
  returnMethod: any;
  onBack: () => void;
}) {
  const authNumber = "RA-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Return Confirmation</h2>

      {/* Confirmation Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border">
        <div className="mb-2">
          <span className="font-semibold">Return Authorization #:</span>
          <span className="ml-2 text-blue-700 text-lg font-mono">
            {authNumber}
          </span>
        </div>

        <div className="mb-2">
          <span className="font-semibold">Order:</span> {selectedOrderId}
        </div>

        {/* Items List */}
        <div className="mb-4">
          <span className="font-semibold">Items:</span>
          <ul className="ml-4 list-disc">
            {selectedItems.map((item) => (
              <li key={item.id} className="mb-1">
                <span className="font-medium">{item.name}</span> ({item.variant}
                ) - ${item.price.toFixed(2)}
                <div className="text-xs text-gray-500">
                  Reason:{" "}
                  {returnDetails.reasons[item.id] === "Other"
                    ? returnDetails.otherReasons[item.id]
                    : returnDetails.reasons[item.id]}
                  , Condition: {returnDetails.conditions[item.id]}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Return + Refund in one row (md+) */}
        <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          <div>
            <span className="font-semibold">Return Method:</span>{" "}
            {returnMethod.shipping}
          </div>
          <div>
            <span className="font-semibold">Refund Method:</span>{" "}
            {returnMethod.refund}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Next Steps</h3>
        <ul className="list-disc ml-6 text-sm">
          <li>Print your return label and attach it to your package.</li>
          <li>Drop off your package at the nearest shipping location or store.</li>
          <li>You will receive email updates as your return progresses.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button variant="outline">Print Label</Button>
        <Button variant="secondary">Email Instructions</Button>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
