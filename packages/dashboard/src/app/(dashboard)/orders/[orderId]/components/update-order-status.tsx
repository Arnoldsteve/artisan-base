"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";
import { OrderStatus, PaymentStatus } from "@/types/orders";

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentStatus: string;
  type: "order" | "payment";
  onSubmit: (status: any) => void;
}

export function UpdateOrderStatusModal({
  isOpen,
  onClose,
  currentStatus,
  type,
  onSubmit,
}: UpdateOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const orderStatuses: OrderStatus[] = [
    "PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", 
    "DELIVERED", "CANCELLED", "RETURNED"
  ];

  const paymentStatuses: PaymentStatus[] = [
    "PENDING", "PAID", "PARTIALLY_PAID", "REFUNDED", "FAILED", "CANCELLED"
  ];

  const options = type === "order" ? orderStatuses : paymentStatuses;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase tracking-widest">
            Update {type === "order" ? "Order" : "Payment"} Status
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
              Select New Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full font-bold">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {options.map((status) => (
                  <SelectItem key={status} value={status} className="font-medium uppercase text-xs">
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="font-bold uppercase text-[10px]">
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              onSubmit(selectedStatus);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[10px]"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}