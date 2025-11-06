"use client";

import React from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Card } from "@repo/ui/components/ui/card";

export const CheckoutLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep } = useCheckoutContext();

  // Final step: Order Confirmation stays simple
  if (currentStep === 4) {
    return (
      <div className="flex justify-center bg-background p-4 md:p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          <Card className="p-6 shadow-sm rounded-lg">
            {children}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-background p-4 md:p-8 min-h-screen">
      <div className="w-full max-w-6xl space-y-8">
        {/* Progress Bar */}
        <div className="p-4 rounded-lg shadow-sm">
          <CheckoutProgress />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Step Content */}
          <Card className="md:col-span-2 p-6 rounded-lg shadow-sm">
            {children}
          </Card>

          {/* Order Summary */}
          <Card className="md:col-span-1 p-6 rounded-lg shadow-sm">
            <OrderSummary />
          </Card>
        </div>
      </div>
    </div>
  );
};
