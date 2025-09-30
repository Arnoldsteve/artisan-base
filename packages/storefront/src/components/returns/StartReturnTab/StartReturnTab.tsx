import React, { useState } from "react";
import { Step1OrderSelect } from "./Step1OrderSelect";
import { Step2ItemSelect } from "./Step2ItemSelect";
import { Step3ReturnDetails } from "./Step3ReturnDetails";
import { Step4ReturnMethod } from "./Step4ReturnMethod";
import { Step5Confirmation } from "./Step5Confirmation";

export function StartReturnTab() {
  const [step, setStep] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [returnDetails, setReturnDetails] = useState<any>(null);
  const [returnMethod, setReturnMethod] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <span className="font-semibold">Step {step} of 5</span>
        <div className="flex-1 h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-700 rounded"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>
      {step === 1 && (
        <Step1OrderSelect
          onNext={(orderId: string) => {
            setSelectedOrderId(orderId);
            setStep(2);
          }}
        />
      )}
      {step === 2 && selectedOrderId && (
        <Step2ItemSelect
          selectedOrderId={selectedOrderId}
          onNext={(items) => {
            setSelectedItems(items);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && selectedItems.length > 0 && (
        <Step3ReturnDetails
          selectedItems={selectedItems}
          onNext={(details) => {
            setReturnDetails(details);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4ReturnMethod
          onNext={(method) => {
            setReturnMethod(method);
            setStep(5);
          }}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 &&
        selectedOrderId &&
        selectedItems.length > 0 &&
        returnDetails &&
        returnMethod && (
          <Step5Confirmation
            selectedOrderId={selectedOrderId}
            selectedItems={selectedItems}
            returnDetails={returnDetails}
            returnMethod={returnMethod}
            onBack={() => setStep(4)}
          />
        )}
    </div>
  );
}
