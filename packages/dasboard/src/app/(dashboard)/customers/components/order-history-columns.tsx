'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Order, OrderStatus, PaymentStatus } from '@/types/orders';
import { Badge } from '@repo/ui';
import Link from 'next/link';
import { getOrderStatusColor, getPaymentStatusColor } from "@/utils/status-colors";

import { Button } from '@repo/ui';
import { formatMoney } from '@/utils/money';

// // We can reuse the same color logic!
// const getOrderStatusColor = (status: OrderStatus) => {
//   // ... (paste the getOrderStatusColor function from the main orders columns file)
// };

export const orderHistoryColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order',
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.id}`} className="font-medium text-blue-500 hover:underline">
        {row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as OrderStatus;
      return <Badge className={`${getOrderStatusColor(status)} hover:bg-none capitalize`}>{status.toLowerCase()}</Badge>;
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const paymentStatus = row.getValue('paymentStatus') as PaymentStatus;  
      return <Badge className={`${getPaymentStatusColor(paymentStatus)} hover:bg-none capitalize`}>{paymentStatus.toLowerCase()}</Badge>;
    }
  },
  {
    accessorKey: 'totalAmount',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      return <div className="text-right font-medium">{formatMoney(amount)}</div>;
    },
  },
   {
    accessorKey: 'createdAt',
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => <div className="text-right">{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
  },
];