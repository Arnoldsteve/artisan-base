"use client";
import React from "react";
import {
  CheckoutProvider,
  useCheckoutContext,
} from "@/contexts/checkout-context";
import { CheckoutLayout } from "@/components/checkout/checkout-layout";
import { CustomerInfoStep } from "@/components/checkout/customer-info-step";
import { ShippingAddressStep } from "@/components/checkout/shipping-address-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { OrderReviewStep } from "@/components/checkout/order-review-step";
import { OrderConfirmationStep } from "@/components/checkout/order-confirmation-step";

const steps = [
  CustomerInfoStep,
  ShippingAddressStep,
  PaymentStep,
  OrderReviewStep,
  OrderConfirmationStep,
];

function CheckoutStepRouter() {
  const { currentStep } = useCheckoutContext();
  const StepComponent = steps[currentStep] || OrderConfirmationStep;
  return <StepComponent />;
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutLayout>
        <CheckoutStepRouter />
      </CheckoutLayout>
    </CheckoutProvider>
  );
}
