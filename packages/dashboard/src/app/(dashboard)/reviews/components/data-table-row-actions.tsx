"use client";

import { MoreHorizontal, Trash } from "lucide-react";
import { Row, Table } from "@tanstack/react-table"; // Add Table import
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Review } from "@/types/reviews";
import { ReviewTableMeta } from "@/types/table-meta";

interface DataTableRowActionsProps {
  row: Row<Review>;
  table: Table<Review>; // Add this prop
}

export function DataTableRowActions({ row, table }: DataTableRowActionsProps) {
  const review = row.original;
  
  /**
   * FIX: Access the meta from the table options.
   * This is the official TanStack Table v8 way to access the meta object.
   */
  const meta = table.options.meta as ReviewTableMeta<Review>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem 
          onClick={() => window.open(`/products/${review.productId}`, '_blank')}
        >
          View Product
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => meta?.openDeleteDialog(review)}
        >
          <Trash className="mr-2 h-3.5 w-3.5" />
          Delete Review
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}