import React from 'react'
// src/app/dashboard/orders/page.tsx
import { mockOrders } from '@/lib/mock-data/orders';
import { OrdersView } from './components/orders-view';

async function getOrders() {
  // Simulate a network delay to test our loading state
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockOrders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <OrdersView initialOrders={orders} />
    </div>
  );
}