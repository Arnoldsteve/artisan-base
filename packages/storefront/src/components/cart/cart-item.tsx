import React from "react";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
      <Image
        src={item.image || `https://picsum.photos/400/400?random=${item.id}`}
        alt={item.name}
        width={64}
        height={64}
        className="rounded object-cover"
      />
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-muted-foreground">
          {formatMoney(item.price, "KES")} 
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="px-2">{item.quantity}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.inventoryQuantity}
          >
            +
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-semibold">
          {formatMoney(item.price * item.quantity, "KES")}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 mt-2"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
