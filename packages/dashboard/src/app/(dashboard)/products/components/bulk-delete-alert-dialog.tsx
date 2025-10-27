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

interface BulkDeleteAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  isPending: boolean;
}

export function BulkDeleteAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isPending,
}: BulkDeleteAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected
            <span className="font-semibold text-foreground">
              {" "}
              {selectedCount} product(s)
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
              {isPending
                ? "Deleting..."
                : `Yes, delete ${selectedCount} product(s)`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
