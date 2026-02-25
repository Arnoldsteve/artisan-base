"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { ShoppingCart, CheckCircle2 } from "lucide-react";

interface CartConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
  productName?: string; // Added to match refactored CartProvider
}

/**
 * SOLID Principle: Single Responsibility
 * This component handles the immediate feedback loop after a successful
 * 'Add to Cart' action, ensuring the user feels in control.
 */
export function CartConfirmationModal({
  isOpen,
  onClose,
  onGoToCart,
  productName,
}: CartConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl">
        <DialogHeader className="flex flex-col items-center justify-center pt-4">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Added to Bag
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-1">
            {productName ? (
              <>
                <span className="font-semibold text-foreground italic">"{productName}"</span> has been successfully added.
              </>
            ) : (
              "Item has been added to your shopping bag."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="default"
            onClick={onGoToCart}
            className="w-full flex items-center justify-center gap-2 h-11 font-bold uppercase tracking-tighter"
          >
            <ShoppingCart className="h-4 w-4" />
            View Bag & Checkout
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground font-medium"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}