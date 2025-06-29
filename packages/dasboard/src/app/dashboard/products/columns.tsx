'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Checkbox } from '@repo/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@repo/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { Product } from '@/types/products';

// Extend the TableMeta interface to include our custom function
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    openDeleteDialog: (product: TData) => void;
    openEditSheet: (product: TData) => void;
    handleDuplicateProduct: (product: TData) => void;
  }
}

export const columns: ColumnDef<Product>[] = [
  // Column for row selection
  {
    id: 'select',
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

  // Column for Product Name and Image
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-md">
            <AvatarImage src={product.images?.[0]?.url} alt={product.name} className="object-cover" />
            <AvatarFallback className="rounded-md">{product.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{product.name}</span>
        </div>
      );
    },
  },

  // Column for Status (isActive)
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Draft'}
        </Badge>
      );
    },
  },

  // Column for Inventory
  {
    accessorKey: 'inventoryQuantity',
    header: 'Inventory',
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
        )
    }
  },

  // Column for Price
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  // Column for Actions
    {
    id: 'actions',
    cell: ({ row, table }) => { // <--- We now have access to `table` here
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
              <DropdownMenuItem onClick={() => table.options.meta?.openEditSheet(product)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.options.meta?.handleDuplicateProduct(product)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                // Call the function from our table's meta options!
                onClick={() => table.options.meta?.openDeleteDialog(product)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];