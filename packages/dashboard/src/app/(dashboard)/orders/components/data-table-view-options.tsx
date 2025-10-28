"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { Card } from "@repo/ui/components/ui/card";

interface OrdersTableViewOptionsProps {
  table: Table<Order>;
}

// Lists for dropdowns
const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "REFUNDED",
  "FAILED",
];

export function OrdersTableViewOptions({ table }: OrdersTableViewOptionsProps) {
  return (
    <Card className="flex flex-wrap items-center rounded-sm shadow-none gap-4 py-4 px-4 my-8">
      {/* Search input */}
      <Input
        placeholder="Search by order # or customer..."
        value={
          (table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("orderNumber")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      {/* Order status filter */}
      <Select
        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
        onValueChange={(value) =>
          table
            .getColumn("status")
            ?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment status filter */}
      <Select
        value={
          (table.getColumn("paymentStatus")?.getFilterValue() as string) ??
          "all"
        }
        onValueChange={(value) =>
          table
            .getColumn("paymentStatus")
            ?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by payment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          {PAYMENT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters */}
      <Button variant="outline" onClick={() => table.resetColumnFilters()}>
        Clear Filters
      </Button>
    </Card>
  );
}
