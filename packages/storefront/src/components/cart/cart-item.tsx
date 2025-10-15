import React from "react";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";
import { Trash } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="border-b last:border-b-0">
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex-shrink-0">
          <Image
            src={
              item.image || `https://picsum.photos/400/400?random=${item.id}`
            }
            alt={item.name}
            width={90}
            height={90}
            className="rounded object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="">{item.name}</p>
          <div className="text-sm text-muted-foreground">
            {formatMoney(item.price, "KES")} per unit
          </div>
          <p className="text-sm text-orange-500">Few units left</p>
        </div>

        <div className="hidden sm:block md:hidden font-semibold text-right min-w-[100px]">
          {formatMoney(item.price * item.quantity, "KES")}
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-b last:border-b-0">
        <div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 flex items-center gap-1"
          >
            <Trash className="h-3 w-3 text-red-500" />
            Remove
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="default"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="px-2">{item.quantity}</span>
          <Button
            size="sm"
            variant="default"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.inventoryQuantity}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
