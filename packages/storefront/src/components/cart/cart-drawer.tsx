import React from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "./cart-item";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
      style={{ maxWidth: 400 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Shopping Cart</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close cart"
        >
          ×
        </Button>
      </div>
      <div
        className="p-4 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>
      <div className="p-4 border-t bg-card">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg">
            ${getTotalPrice().toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearCart}
            disabled={items.length === 0}
            className="flex-1"
          >
            Clear Cart
          </Button>
          <Button
            variant="default"
            className="flex-1"
            disabled={items.length === 0}
            onClick={() => {
              router.push("/checkout");
              onClose();
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
