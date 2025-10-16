"use client";

import React from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { OrderSummary } from "@/components/checkout/order-summary";

export const CheckoutLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep } = useCheckoutContext();

  return (
    <div className="container py-8">
      <CheckoutProgress />

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div 
        className={currentStep === 4 ? "md:col-span-3" : "md:col-span-2"}
        >
          {children}
        </div>
        {currentStep < 4 && (
          <div className="md:col-span-1">
            <OrderSummary />
          </div>
         )} 
      </div>
    </div>
  );
};
