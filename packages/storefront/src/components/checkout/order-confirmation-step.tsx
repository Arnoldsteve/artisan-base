import React, { useEffect } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";

export const OrderConfirmationStep: React.FC = () => {
  const { order, resetCheckout } = useCheckoutContext();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    setTimeout(resetCheckout, 20000);
  }, []);

  if (!order) return <div className="text-center py-12">No order found.</div>;

  return (
    <div className="space-y-6 text-center py-12">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Thank you for your order!
      </h2>
      <Separator />
      <div className="text-lg mb-2">Order #{order.id}</div>
      <div className="text-muted-foreground mb-4">
        Estimated delivery:{" "}
        {order.estimatedDelivery
          ? new Date(order.estimatedDelivery).toLocaleDateString()
          : "N/A"}
      </div>
      <Button asChild>
        <a href="/products">Continue Shopping</a>
      </Button>
    </div>
  );
};
