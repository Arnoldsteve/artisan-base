'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Checkbox } from '@repo/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@repo/ui';
import { Order, OrderStatus, PaymentStatus } from '@/types/orders';
import Link from 'next/link';

// Helper function for OrderStatus colors
const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
    case 'CONFIRMED': return 'bg-blue-500/20 text-blue-700 border-blue-500/20';
    case 'PROCESSING': return 'bg-indigo-500/20 text-indigo-700 border-indigo-500/20';
    case 'SHIPPED': return 'bg-cyan-500/20 text-cyan-700 border-cyan-500/20';
    case 'DELIVERED': return 'bg-green-500/20 text-green-700 border-green-500/20';
    case 'CANCELLED': return 'bg-red-500/20 text-red-700 border-red-500/20';
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/20';
  }
};

// Helper function for PaymentStatus colors
const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID': return 'bg-green-500/20 text-green-700 border-green-500/20';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'REFUNDED': return 'bg-gray-500/20 text-gray-700 border-gray-500/20';
      case 'FAILED': return 'bg-red-500/20 text-red-700 border-red-500/20';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/20';
    }
};

// Declare the new function that will be available on the table's meta object
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    openDeleteDialog: (order: TData) => void;
  }
}

export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    accessorKey: 'orderNumber',
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('orderNumber')}</div>
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
        const customer = row.original.customer;
        if (!customer) return <span className="text-muted-foreground">Guest</span>;
        const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
        return <div>{name || customer.email}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as OrderStatus;
        return <Badge className={`${getOrderStatusColor(status)} hover:bg-none capitalize`}>{status.toLowerCase()}</Badge>;
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as PaymentStatus;
        return <Badge variant="outline" className={`${getPaymentStatusColor(status)} hover:bg-none capitalize`}>{status.toLowerCase()}</Badge>;
    }
  },
  {
    accessorKey: 'totalAmount',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right">{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const order = row.original;
      const customer = order.customer;
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
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    View Order Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild disabled={!customer}>
                  <Link href={customer ? `/dashboard/customers/${customer.email}` : '#'}>
                    View Customer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => table.options.meta?.openDeleteDialog(order)}
                >
                  Delete Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];