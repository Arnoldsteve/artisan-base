import React from "react";
import { useCart } from "@/hooks/use-cart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Loader2, ShoppingBag } from "lucide-react";
import { Separator } from "@repo/ui/components/ui/separator";
import { Button } from "@repo/ui/components/ui/button";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { shippingOptions } from "@/lib/shipping-options";

export const OrderSummary: React.FC = () => {
  const { submitOrder, previousStep, isLoading, selectedShippingOption } =
    useCheckoutContext();

  const { items, getTotalPrice } = useCart();

  // Pick shipping price based on selected option (fallback = first option)
  const shipping = selectedShippingOption
    ? selectedShippingOption.price
    : shippingOptions[0].price;

  const tax = getTotalPrice() * 0.08;
  const total = getTotalPrice() + shipping + tax;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No items in cart.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  Ksh {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Ksh {getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <div className="text-right">
              {shipping === 0 ? (
                <div>
                  <span className="text-green-600 font-medium">Free</span>
                  <p className="text-xs text-muted-foreground">
                    Orders over KSh 10,000
                  </p>
                </div>
              ) : (
                <span>Ksh {shipping.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>Ksh {tax.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Ksh {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={submitOrder}
            className="w-full"
            disabled={items.length === 0 || isLoading}
            size={"lg"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={previousStep}
            className="w-full"
          >
            Back to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
