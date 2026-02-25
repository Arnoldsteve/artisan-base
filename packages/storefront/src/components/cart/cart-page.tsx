"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/components/ui/card";
import { ArrowLeft, Store, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems, clearCart, clearTenantItems } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /**
   * TOP 1% LOGIC: Vendor Grouping
   * We group items by tenantId so the customer knows which items 
   * belong to which artisan store.
   */
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.tenantId]) {
        acc[item.tenantId] = {
          name: item.tenantName || "Artisan Store",
          items: [],
        };
      }
      acc[item.tenantId].items.push(item);
      return acc;
    }, {} as Record<string, { name: string; items: typeof items }>);
  }, [items]);

  if (!mounted) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading your bag...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen p-4 md:p-10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Cart Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Shopping Bag ({getTotalItems()})
              </h1>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Clear All
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <Card className="p-20 text-center flex flex-col items-center border-dashed">
                <p className="text-muted-foreground mb-6">Your bag is currently empty.</p>
                <Link href="/products">
                  <Button>Start Exploring</Button>
                </Link>
              </Card>
            ) : (
              Object.entries(groupedItems).map(([tenantId, group]) => (
                <Card key={tenantId} className="overflow-hidden border-none shadow-sm">
                  {/* Vendor Header */}
                  <div className="bg-muted/50 px-6 py-3 flex items-center justify-between border-b">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-primary" />
                      <span className="font-bold text-sm uppercase tracking-wider">{group.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-[10px] uppercase font-bold"
                      onClick={() => clearTenantItems(tenantId)}
                    >
                      Remove All from Store
                    </Button>
                  </div>

                  <div className="p-6 space-y-2">
                    {group.items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-96">
            <Card className="p-6 sticky top-24 shadow-md border-none">
              <h2 className="font-bold text-xl mb-6">Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatMoney(getTotalPrice(), "KES")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Shipping</span>
                  <span className="text-green-600 font-medium">Calculated at checkout</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatMoney(getTotalPrice(), "KES")}</span>
                </div>
              </div>

              <Button
                className="w-full mt-8 h-12 bg-blue-600 hover:bg-blue-700 font-bold uppercase tracking-widest"
                disabled={items.length === 0}
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <p className="text-[10px] text-center text-muted-foreground mt-4">
                By proceeding, you agree to Artisan Base terms of service.
              </p>
            </Card>

            <Link href="/products" className="flex items-center gap-2 mt-6 text-sm font-medium text-blue-600 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}