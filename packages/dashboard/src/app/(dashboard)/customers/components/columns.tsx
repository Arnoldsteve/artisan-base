'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { Checkbox } from '@repo/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@repo/ui';
import { Avatar, AvatarFallback } from '@repo/ui';
import { toast } from 'sonner';
import { formatMoney } from '@/utils/money';
import { formatDate } from '@/utils/date';
import { CustomerTableMeta, TableWithMeta } from '@/types/table-meta';

// Define the shape of our customer data for the table
export type CustomerColumn = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
};

// REMOVE the global module declaration completely
// No more: declare module '@tanstack/react-table' { ... }

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
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
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-muted-foreground">{customer.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: 'email', // Explicitly set the ID to 'email'
    accessorKey: 'email',
    header: 'Email', // Header for completeness, though it will be hidden
    // We don't need a custom 'cell' because we'll hide this column.
  },
  {
    accessorKey: 'orderCount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Orders
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('orderCount')}</div>;
    },
  },
  {
    accessorKey: 'totalSpent',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = formatMoney(parseFloat(row.getValue('totalSpent')));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Member Since
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {formatDate(row.getValue('createdAt'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const customer = row.original;
      // Type assertion for the table with CustomerTableMeta
      const typedTable = table as TableWithMeta<CustomerColumn, CustomerTableMeta<CustomerColumn>>;
      
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
              <DropdownMenuItem onClick={() => typedTable.options.meta?.openEditSheet(customer)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => typedTable.options.meta?.viewCustomerDetails(customer)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(customer.id);
                toast.success('Customer ID copied to clipboard.');
              }}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() => typedTable.options.meta?.openDeleteDialog(customer)}
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