// src/app/dashboard/orders/components/update-status-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { OrderStatus } from "@/types/orders";
import { Label } from "@repo/ui/components/ui/label";

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
  onSave: () => void;
  isPending: boolean;
}

const allStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function UpdateStatusDialog({
  isOpen,
  onClose,
  currentStatus,
  onStatusChange,
  onSave,
  isPending,
}: UpdateStatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Select a new status for this order. The customer may be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="status" className="text-left">
            New Status
          </Label>
          <Select
            defaultValue={currentStatus}
            onValueChange={(value) => onStatusChange(value as OrderStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
