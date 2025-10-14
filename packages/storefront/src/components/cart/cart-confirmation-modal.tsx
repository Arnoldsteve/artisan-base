// File: components/cart/cart-confirmation-modal-static.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface StaticCartConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
}

export function CartConfirmationModal({
  isOpen,
  onClose,
  onGoToCart,
}: StaticCartConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Please select a variation</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={onGoToCart}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Go to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
