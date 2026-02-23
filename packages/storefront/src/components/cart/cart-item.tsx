"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItemType;
}

/**
 * SOLID Principle: Single Responsibility
 * This component is responsible for rendering an individual row in the cart
 * and providing direct hooks into the quantity/removal logic.
 */
export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const isLowStock = item.inventoryQuantity > 0 && item.inventoryQuantity <= 5;

  return (
    <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-b-0">
      {/* 1. Product Thumbnail */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={item.image || `https://picsum.photos/200/200?random=${item.id}`}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* 2. Item Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-foreground">
          <Link 
            href={`/products/${item.slug}`} 
            className="hover:text-blue-600 transition-colors line-clamp-1 pr-4"
          >
            {item.name}
          </Link>
          <p className="font-bold tabular-nums">
            {formatMoney(item.price * item.quantity, "KES")}
          </p>
        </div>
        
        <p className="mt-1 text-xs text-muted-foreground">
          Unit Price: {formatMoney(item.price, "KES")}
        </p>

        {/* Inventory Feedback for high-scale conversion */}
        {isLowStock && (
          <p className="mt-1 text-[10px] font-bold text-orange-600 uppercase">
            Only {item.inventoryQuantity} left in stock
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {/* 3. Quantity Controls */}
          <div className="flex items-center rounded-sm border bg-background h-8">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-2 hover:text-blue-600 disabled:opacity-30 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.inventoryQuantity}
              className="px-2 hover:text-blue-600 disabled:opacity-30 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* 4. Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(item.id)}
            className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};