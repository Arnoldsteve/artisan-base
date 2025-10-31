"use client";

import { useEffect, useState } from "react";
import { OrderStatus, PaymentStatus } from "@/types/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// ✅ Discriminated union props type
type UpdateOrderStatusModalProps =
  | {
      type: "order";
      isOpen: boolean;
      onClose: () => void;
      orderId: string;
      currentStatus: OrderStatus;
      onSubmit?: (newStatus: OrderStatus) => void;
    }
  | {
      type: "payment";
      isOpen: boolean;
      onClose: () => void;
      orderId: string;
      currentStatus: PaymentStatus;
      onSubmit?: (newStatus: PaymentStatus) => void;
    };

export function UpdateOrderStatusModal(props: UpdateOrderStatusModalProps) {
  const { type, isOpen, onClose, orderId, currentStatus, onSubmit } = props;

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setStatus(currentStatus);
  }, [isOpen, currentStatus]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log(`Updating ${type} status for order ${orderId} to`, status);

      // Simulate API delay
      await new Promise((r) => setTimeout(r, 800));

      toast.success(
        `${
          type === "order" ? "Order" : "Payment"
        } status updated successfully to ${status}`
      );

      // Call callback safely
      onSubmit?.(status as any);
      onClose();
    } catch {
      toast.error("Failed to update status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const options =
    type === "order"
      ? [
          { value: "PENDING", label: "Pending" },
          { value: "CONFIRMED", label: "Confirmed" },
          { value: "PROCESSING", label: "Processing" },
          { value: "SHIPPED", label: "Shipped" },
          { value: "DELIVERED", label: "Delivered" },
          { value: "CANCELLED", label: "Cancelled" },
        ]
      : [
          { value: "PENDING", label: "Pending" },
          { value: "PAID", label: "Paid" },
          { value: "REFUNDED", label: "Refunded" },
          { value: "FAILED", label: "Failed" },
        ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "order" ? "Update Order Status" : "Update Payment Status"}
          </DialogTitle>
          <DialogDescription>
            Change the {type === "order" ? "order" : "payment"} status for this
            order.
          </DialogDescription>
        </DialogHeader>

        {/* Select Field */}
        <div className="flex flex-col gap-4 py-2">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as typeof status)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
