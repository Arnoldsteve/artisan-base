"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";

interface DeleteOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  isPending: boolean;
}

export function DeleteOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isPending,
}: DeleteOrderDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order
            <span className="font-semibold text-foreground">
              {" "}
              {orderNumber}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              disabled={isPending}
              variant="destructive"
            >
              {isPending ? "Deleting..." : "Yes, delete order"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
