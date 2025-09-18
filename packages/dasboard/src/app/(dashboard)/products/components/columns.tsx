"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Trash, Upload, Copy, Pencil, Tag } from "lucide-react";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { Product } from "@/types/products";
import { formatMoney } from "@/utils/money";

// Extend the TableMeta interface to include our custom function
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    openDeleteDialog: (product: TData) => void;
    openEditSheet: (product: TData) => void;
    handleDuplicateProduct: (product: TData) => void;
    handleImageUpload: (product: TData) => void;
    handleCategoryChange: (product: TData) => void;
    openImagePreview: (product: TData) => void; 
  }
}

export const columns: ColumnDef<Product>[] = [
  // Column for row selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
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

  // Column for Product Name and Image
  {
    accessorKey: "name",
    header: "Product",
   cell: ({ row, table }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-10 w-10 rounded-md cursor-pointer"
            onClick={() => table.options.meta?.openImagePreview(product)}
          >
            <AvatarImage
              src={product.images?.[0]?.url}
              alt={product.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-md">
              {product.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{product.name}</span>
        </div>
      );
    }
  },

  // Column for Status (isActive)
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Draft"}
        </Badge>
      );
    },
    // Add a filter function for our new dropdown
    filterFn: (row, columnId, value) => {
      if (value === "all") return true;
      return row.getValue(columnId) === (value === "true");
    },
  },

  // Column for Inventory
  {
    accessorKey: "inventoryQuantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Inventory
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = row.original.inventoryQuantity;
      return (
        <div className="flex items-center gap-2">
          {quantity > 0 ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          ) : (
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <span>{quantity} in stock</span>
        </div>
      );
    },
  },

  // Column for Price
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = formatMoney(parseFloat(row.getValue("price")));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },

  // Column for Actions
  {
    id: "actions",
    cell: ({ row, table }) => {
      // <--- We now have access to `table` here
      const product = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => table.options.meta?.openEditSheet(product)}
              >
                <Pencil className="w-5 h-5 text-blue-600" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.options.meta?.handleDuplicateProduct(product)}
              >
                <Copy className="w-5 h-5 text-green-600" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.options.meta?.handleImageUpload(product)}
              >
                <Upload className="w-5 h-5" />
                Upload Images
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.options.meta?.handleCategoryChange(product)}
              >
                <Tag  className="w-5 h-5" />
                Assign Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => table.options.meta?.openDeleteDialog(product)}
                >
                  <Trash className="w-5 h-5 text-red-600" />
                  Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
