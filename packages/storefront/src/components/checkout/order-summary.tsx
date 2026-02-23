"use client";

import React, { useMemo } from "react";
import { useCart } from "@/hooks/use-cart";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Loader2, ShoppingBag, Store } from "lucide-react";
import { Separator } from "@repo/ui/components/ui/separator";
import { Button } from "@repo/ui/components/ui/button";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { formatMoney } from "@/lib/money";

// Constants for platform-wide calculations
const TAX_RATE = 0.16; // 16% VAT for Kenya market

export const OrderSummary: React.FC = () => {
  const {
    submitOrder,
    previousStep,
    isLoading,
    customer,
    shippingAddress,
    selectedPaymentMethod,
    selectedShippingOption,
  } = useCheckoutContext();

  const { items, getTotalPrice } = useCart();

  /**
   * TOP 1% LOGIC: Grouping items by Vendor for the summary
   */
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.tenantId]) {
        acc[item.tenantId] = { name: item.tenantName || "Artisan", items: [] };
      }
      acc[item.tenantId].items.push(item);
      return acc;
    }, {} as Record<string, { name: string; items: typeof items }>);
  }, [items]);

  const subtotal = getTotalPrice();
  const shipping = selectedShippingOption?.price || 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  // Security & Validation Gate
  const isReadyToShip =
    !!customer &&
    !!shippingAddress &&
    !!selectedPaymentMethod &&
    items.length > 0;

  return (
    <div className="sticky top-24">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-blue-600" />
          Review Order
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 px-0 pb-0">
        {/* 1. Itemized List Grouped by Store */}
        <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
          {Object.entries(groupedItems).map(([tenantId, group]) => (
            <div key={tenantId} className="space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Store className="h-3 w-3" />
                From {group.name}
              </div>
              {group.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatMoney(item.price * item.quantity, "KES")}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <Separator />

        {/* 2. Financial Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium tabular-nums">{formatMoney(subtotal, "KES")}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium tabular-nums">
              {shipping === 0 ? "FREE" : formatMoney(shipping, "KES")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. VAT (16%)</span>
            <span className="font-medium tabular-nums">{formatMoney(tax, "KES")}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-baseline">
            <span className="font-bold text-lg">Total</span>
            <span className="font-extrabold text-2xl text-blue-600 tabular-nums">
              {formatMoney(total, "KES")}
            </span>
          </div>
        </div>

        {/* 3. Primary Actions */}
        <div className="pt-4 space-y-3">
          <Button
            variant="default"
            onClick={submitOrder}
            className="w-full h-14 text-base font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            disabled={!isReadyToShip || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Purchase"
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={previousStep}
            className="w-full text-muted-foreground font-medium"
            disabled={isLoading}
          >
            Return to Step {Math.max(1, 1)}
          </Button>
        </div>

        {/* 4. Security Trust Badge */}
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter pt-2">
          Secure Multi-Vendor Checkout via Artisan Base
        </p>
      </CardContent>
    </div>
  );
};