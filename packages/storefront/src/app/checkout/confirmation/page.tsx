"use client";


import { OrderConfirmationStep } from "@/components/checkout/order-confirmation-step";
import { CheckoutProvider } from "@/contexts/checkout-context";

export default function Page() {
  return (
    <CheckoutProvider>
      <OrderConfirmationStep />;
    </CheckoutProvider>
  );
}
