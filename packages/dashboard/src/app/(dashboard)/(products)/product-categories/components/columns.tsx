"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Trash,
  Pencil,
  Package,
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
import { Category } from "@/types/categories";
import { CategoryTableMeta, TableWithMeta } from "@/types/table-meta";

export const columns: ColumnDef<
  Category & { _count?: { products: number } }
>[] = [
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
          <div className="h-6 w-6 rounded-md bg-blue-500 flex items-center justify-center text-white font-medium">
            {category.name.charAt(0).toUpperCase()}
          </div>
          <span
            className="font-sm"
            data-testid={`category-name-${category.id}`}
          >
            {category.name}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-xs">
          {description ? (
            <span
              className="text-xs text-gray-600 line-clamp-2"
              title={description}
            >
              {description}
            </span>
          ) : (
            <span className="text-sm text-gray-400 italic">No description</span>
          )}
        </div>
      );
    },
  },

  {
    id: "productsCount",
    header: "Products",
    accessorFn: (row) => row._count?.products ?? 0,
    cell: ({ row }) => {
      const count = row.original._count?.products || 0;
      return (
        <div className="flex items-center text-xs gap-2">
          {count} product{count !== 1 ? "s" : ""}
        </div>
      );
    },
  },

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
        <div className="text-xs text-gray-600">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const category = row.original;
      const typedTable = table as TableWithMeta<
        Category & { _count?: { products: number } },
        CategoryTableMeta<Category & { _count?: { products: number } }>
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
                onClick={() => typedTable.options.meta?.openEditSheet(category)}
              >
                <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open(`/product-categories/${category.id}`, "_blank")
                }
              >
                <Package className="w-4 h-4 mr-2 text-green-600" />
                View Products
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() =>
                  typedTable.options.meta?.openDeleteDialog(category)
                }
              >
                <Trash className="w-4 h-4 mr-2 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
