import React from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";

const steps = [
  "Customer Info",
  "Shipping",
  "Payment",
  "Review",
  "Confirmation",
];

export const CheckoutProgress: React.FC = () => {
  const { currentStep, goToStep } = useCheckoutContext();
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <button
            type="button"
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
              ${
                currentStep === idx
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep > idx
                    ? "bg-muted border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground"
              }
            `}
            onClick={() => goToStep(idx)}
            aria-current={currentStep === idx ? "step" : undefined}
            aria-label={step}
          >
            {idx + 1}
          </button>
          {idx < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-2 rounded transition-colors
                ${currentStep > idx ? "bg-primary" : "bg-muted"}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
