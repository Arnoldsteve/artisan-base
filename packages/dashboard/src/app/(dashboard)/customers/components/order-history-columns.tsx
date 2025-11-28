"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { Badge } from "@repo/ui";
import Link from "next/link";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/status-colors";

import { Button } from "@repo/ui";
import { formatMoney } from "@/utils/money";
import { formatDate } from "@/utils/date";
import React from "react";

// // We can reuse the same color logic!
// const getOrderStatusColor = (status: OrderStatus) => {
//   // ... (paste the getOrderStatusColor function from the main orders columns file)
// };

export const orderHistoryColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium text-blue-500 hover:underline"
      >
        {row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: React.memo(({ row }) => {
      const amount = parseFloat(row.getValue("subtotal"));
      return <div>{formatMoney(amount)}</div>;
    }),
  },
  {
    accessorKey: "taxAmount",
    header: "Tax",
    cell: React.memo(({ row }) => {
      const amount = parseFloat(row.getValue("taxAmount"));
      return <div>{formatMoney(amount)}</div>;
    }),
  },
  {
    accessorKey: "shippingAmount",
    header: "Shipping",
    cell: React.memo(({ row }) => {
      const amount = parseFloat(row.getValue("shippingAmount"));
      return <div>{formatMoney(amount)}</div>;
    }),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return <div>{formatMoney(amount)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Order",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return (
        <span
          style={{ color: getOrderStatusColor(status) }}
          className="capitalize"
        >
          {status.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as PaymentStatus;
      return (
        <span
          style={{ color: getPaymentStatusColor(status) }}
          className="capitalize"
        >
          {status.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
];
