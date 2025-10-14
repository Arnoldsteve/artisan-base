// File: src/app/cart/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-6xl justify-center mx-auto p-6 bg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        <Card>
          <div className="flex-1 bg-card p-4 rounded-lg shadow-sm">
            <h1 className="font-semibold text-lg mb-4">
              Shopping Cart ({mounted ? getTotalItems() : 0})
            </h1>
            {!mounted ? (
              <div className="text-center text-muted-foreground py-12">
                <p>Loading cart…</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.id} item={item} />)
            )}
          </div>
        </Card>

        {/* Summary / Actions */}
        <Card>
          <div className="w-full md:w-80 bg-card p-4 rounded-lg shadow-sm flex flex-col justify-between h-full">
            {/* Top content / summary */}
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Cart Summary</h2>

              <div className="flex justify-between mb-2 text-sm">
                <span>Item's total ({mounted ? getTotalItems() : 0})</span>
                <span>{mounted ? `${formatMoney(getTotalPrice())}` : "—"}</span>
              </div>

              <div className="flex justify-between font-medium text-base border-t pt-2 mt-2">
                <span>Subtotal</span>
                <span>{mounted ? `${formatMoney(getTotalPrice())}` : "—"}</span>
              </div>
            </div>

            {/* Buttons stick to bottom */}
            <div className="flex flex-col gap-2 mt-auto">
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={!mounted || items.length === 0}
              >
                Clear Cart
              </Button>
              <Button
                variant="default"
                disabled={!mounted || items.length === 0}
                onClick={() => router.push("/checkout")}
              >
                Checkout ({formatMoney(getTotalPrice())})
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex  items-center gap-2 pt-4">
        <Button variant="outline" onClick={() => router.push("/products")}>
          <ArrowLeft className="h-3 w-3" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
