import React from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@repo/ui/components/ui/button";

export const OrderReviewStep: React.FC = () => {
  const { customer, shippingAddress, selectedShippingOption, selectedPaymentMethod, previousStep, submitOrder, isLoading } = useCheckoutContext();
  const { items } = useCart();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
      <div className="space-y-2">
        <h3 className="font-semibold">Customer Info</h3>
        <div className="bg-muted p-3 rounded">
          {customer?.firstName} {customer?.lastName}<br />
          {customer?.email}<br />
          {customer?.phone}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Shipping Address</h3>
        <div className="bg-muted p-3 rounded">
          {shippingAddress?.street}<br />
          {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}<br />
          {shippingAddress?.country}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Shipping Option</h3>
        <div className="bg-muted p-3 rounded">
          {selectedShippingOption?.name} - ${selectedShippingOption?.price.toFixed(2)}<br />
          {selectedShippingOption?.description} ({selectedShippingOption?.estimatedDays})
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Payment Method</h3>
        <div className="bg-muted p-3 rounded">
          {selectedPaymentMethod?.name}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Cart Items</h3>
        <div className="bg-muted p-3 rounded space-y-1">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={previousStep}>Back</Button>
        <Button onClick={submitOrder} disabled={isLoading}>{isLoading ? "Placing Order..." : "Place Order"}</Button>
      </div>
    </div>
  );
}; 