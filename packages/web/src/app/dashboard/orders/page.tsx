// packages/web/src/app/dashboard/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'; // Add badge for styling
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => console.error('Failed to fetch orders', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customerEmail}</TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell className="text-right">${order.totalAmount}</TableCell>
                    <TableCell className="text-right">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}