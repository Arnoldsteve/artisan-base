import React from "react";
import { useCart } from "@/hooks/use-cart";

export const OrderSummary: React.FC = () => {
  const { items, getTotalPrice } = useCart();
  // For now, mock shipping and tax
  const shipping = getTotalPrice() > 100 ? 0 : 5.99;
  const tax = getTotalPrice() * 0.08;
  const total = getTotalPrice() + shipping + tax;

  return (
    <div className="bg-card rounded-lg shadow p-4 sticky top-24">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      <div className="space-y-2 mb-4">
        {items.length === 0 ? (
          <div className="text-muted-foreground text-sm">No items in cart.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
