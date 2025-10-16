"use client";

import React from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { OrderSummary } from "@/components/checkout/order-summary";

export const CheckoutLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep } = useCheckoutContext();

  if (currentStep === 4) {
    return <div className="container py-8">{children}</div>;
  }

  return (
    <div className="container py-8">
      <CheckoutProgress />
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">{children}</div>
        <div className="md:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
