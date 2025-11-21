"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-muted-foreground py-12">
        <p>Loading cart…</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center  items-center bg-background p-0 md:p-6">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cart Items */}
          <Card className="flex-1 p-4 rounded-lg shadow-sm">
            <h1 className="font-semibold text-lg mb-4">
              Shopping Cart ({getTotalItems()})
            </h1>

            <Separator />

            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.id} item={item} />)
            )}
          </Card>

          {/* Summary / Actions */}
          <Card className="w-full md:w-80 p-4 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Cart Summary</h2>

              <div className="flex justify-between mb-2 text-sm">
                <span>Item's total ({getTotalItems()})</span>
                <span>{formatMoney(getTotalPrice())}</span>
              </div>

              <div className="flex justify-between font-medium text-base border-t pt-2 mt-2">
                <span>Subtotal</span>
                <span>{formatMoney(getTotalPrice())}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={items.length === 0}
              >
                Clear Cart
              </Button>
              <Button
                variant="default"
                disabled={items.length === 0}
                onClick={() => router.push("/checkout")}
              >
                Checkout ({formatMoney(getTotalPrice())})
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="h-3 w-3" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
