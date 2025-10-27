"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Trash,
  Upload,
  Copy,
  Pencil,
  Tag,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Product } from "@/types/products";
import { formatMoney } from "@/utils/money";
import { ProductTableMeta, TableWithMeta } from "@/types/table-meta";


export const columns: ColumnDef<Product>[] = [
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

  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row, table }) => {
      const product = row.original;
      // Type assertion for the table with ProductTableMeta
      const typedTable = table as TableWithMeta<
        Product,
        ProductTableMeta<Product>
      >;

      return (
        <div className="flex items-center gap-3">
          <Avatar
            className="h-6 w-8 rounded-md cursor-pointer"
            onClick={() => typedTable.options.meta?.openImagePreview(product)}
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
          <span className="font-sm">{product.name}</span>
        </div>
      );
    },
  },

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
        <span
          className={`text-xs font-medium ${
            isActive ? "text-green-600" : "text-orange-500"
          }`}
        >
          {isActive ? "Active" : "Draft"}
        </span>
      );
    },
    // Add a filter function for our new dropdown
    filterFn: (row, columnId, value) => {
      if (value === "all") return true;
      return row.getValue(columnId) === (value === "true");
    },
  },

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

  {
    id: "actions",
    cell: ({ row, table }) => {
      const product = row.original;
      const typedTable = table as TableWithMeta<
        Product,
        ProductTableMeta<Product>
      >;

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
                onClick={() => typedTable.options.meta?.openEditSheet(product)}
              >
                <Pencil className="w-5 h-5 text-blue-600" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  typedTable.options.meta?.handleDuplicateProduct(product)
                }
              >
                <Copy className="w-5 h-5 text-green-600" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  typedTable.options.meta?.handleImageUpload(product)
                }
              >
                <Upload className="w-5 h-5" />
                Upload Images
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  typedTable.options.meta?.handleCategoryChange(product)
                }
              >
                <Tag className="w-5 h-5" />
                Assign Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() =>
                  typedTable.options.meta?.openDeleteDialog(product)
                }
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
