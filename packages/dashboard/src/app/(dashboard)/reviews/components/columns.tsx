"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/reviews";
import { Star } from "lucide-react";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";

export const columns: ColumnDef<Review>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;
      if (!customer) return <span className="text-muted-foreground italic">Guest</span>;

      return (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-bold text-sm text-foreground">
            {customer.firstName} {customer.lastName}
          </span>
          <span className="text-[11px] text-muted-foreground lowercase">
            {customer.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const product = row.original.product;
      if (!product) return <span className="text-muted-foreground italic">Product not found</span>;

      return (
        <div className="flex flex-col gap-0.5 py-1 min-w-[150px]">
          <Link
            href={`/products/${row.original.productId}`}
            className="font-bold text-sm text-blue-600 hover:underline transition-all"
          >
            {product.name}
          </Link>
          <span className="text-[10px] text-muted-foreground font-mono tracking-tight uppercase">
            SKU: {product.sku || "N/A"}
          </span>
        </div>
      );
    },
  },
  // ============================================================
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center gap-0.5 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`size-3.5 ${i < rating ? "fill-current" : "text-muted/30"}`} 
            />
          ))}
          <span className="ml-1.5 text-xs font-medium text-muted-foreground">
            {rating}.0
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <div className="max-w-[350px] whitespace-normal text-sm leading-tight text-foreground/80">
        {row.getValue("comment") || (
          <span className="text-muted-foreground/60 italic">No text provided</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground tabular-nums">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];