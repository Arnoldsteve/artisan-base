"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Trash, Pencil, Package } from "lucide-react";
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
import { Category } from "@/types/category";

// Extend the TableMeta interface to include our custom functions
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    openDeleteDialog: (category: TData) => void;
    openEditSheet: (category: TData) => void;
  }
}

export const columns: ColumnDef<Category & { _count?: { products: number } }>[] = [
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

  // Column for Category Name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
            {category.name.charAt(0).toUpperCase()}
          </div>
          <span
            className="font-medium"
            data-testid={`category-name-${category.id}`}
          >
            {category.name}
          </span>
        </div>
      );
    },
  },

  // Column for Description
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-xs">
          {description ? (
            <span className="text-sm text-gray-600 line-clamp-2" title={description}>
              {description}
            </span>
          ) : (
            <span className="text-sm text-gray-400 italic">No description</span>
          )}
        </div>
      );
    },
  },

  // Column for Product Count
  {
    accessorKey: "_count.products",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Products
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const count = row.original._count?.products || 0;
      return (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <Badge variant="secondary">
            {count} product{count !== 1 ? 's' : ''}
          </Badge>
        </div>
      );
    },
  },

  // Column for Created Date
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },

  // Column for Actions
  {
    id: "actions",
    cell: ({ row, table }) => {
      const category = row.original;
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
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => table.options.meta?.openEditSheet(category)}
                >
                  <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                  Edit
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => window.open(`/product-categories/${category.id}`, '_blank')}
                >
                  <Package className="w-4 h-4 mr-2 text-green-600" />
                  View Products
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => table.options.meta?.openDeleteDialog(category)}
                >
                  <Trash className="w-4 h-4 mr-2 text-red-600" />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];