// src/app/dashboard/customers/[customerId]/components/customer-orders-view.tsx
'use client';

import { useState } from 'react';
import { Order } from '@/types/orders';
import { orderHistoryColumns } from './order-history-columns';
import { DataTable } from '@/components/shared/data-table';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';

export function CustomerOrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const [orders] = useState<Order[]>(initialOrders);

  const table = useReactTable({
    data: orders,
    columns: orderHistoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
        <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
        <CardContent>
            <DataTable table={table} />
        </CardContent>
    </Card>
  )
}