import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@repo/ui/components/ui/button";

interface CartButtonProps {
  onClick: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const count = getTotalItems();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="relative"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs px-1.5 py-0.5">
          {count}
        </span>
      )}
    </Button>
  );
};
