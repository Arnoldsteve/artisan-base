import React from "react";
import { CheckoutProgress } from "./checkout-progress";
import { OrderSummary } from "./order-summary";

export const CheckoutLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutProgress />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">{children}</div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
