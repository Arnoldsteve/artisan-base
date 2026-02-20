"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { BillingHistoryItem } from "@/types/billing";
import { DownloadIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export const columns: ColumnDef<BillingHistoryItem>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-xs font-medium tabular-nums">
          {new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      // Enterprise Standard: We can fallback to KES or pull from tenant context
      return (
        <span className="font-bold text-sm">
          {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Method",
    cell: ({ row }) => (
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted rounded">
        {row.getValue("provider")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toUpperCase();
      const isSuccess = status === "PAID" || status === "SUCCESS";
      
      return (
        <Badge 
          variant={isSuccess ? "default" : "outline"}
          className={isSuccess ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/10" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Receipt</div>,
    cell: () => (
      <div className="text-right">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5">
          <DownloadIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    ),
  },
];