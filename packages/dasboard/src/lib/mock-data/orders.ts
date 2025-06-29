// src/lib/mock-data/orders.ts

import { Order } from "@/types/orders";

export const mockOrders: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: 'ORD-2024-0001',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    totalAmount: 159.99,
    createdAt: '2024-03-10T10:00:00Z',
    customer: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
  },
  {
    id: 'ord_1002',
    orderNumber: 'ORD-2024-0002',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    totalAmount: 89.50,
    createdAt: '2024-03-09T14:30:00Z',
    customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
  },
  {
    id: 'ord_1003',
    orderNumber: 'ORD-2024-0003',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    totalAmount: 210.00,
    createdAt: '2024-03-09T09:15:00Z',
    customer: { firstName: 'Peter', lastName: 'Jones', email: 'peter.jones@example.com' },
  },
  {
    id: 'ord_1004',
    orderNumber: 'ORD-2024-0004',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    totalAmount: 45.00,
    createdAt: '2024-03-08T18:00:00Z',
    customer: { firstName: 'Mary', lastName: 'Johnson', email: 'mary.j@example.com' },
  },
  {
    id: 'ord_1005',
    orderNumber: 'ORD-2024-0005',
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    totalAmount: 120.25,
    createdAt: '2024-03-07T11:45:00Z',
    customer: { firstName: 'David', lastName: 'Williams', email: 'd.williams@example.com' },
  },
  {
    id: 'ord_1006',
    orderNumber: 'ORD-2024-0006',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalAmount: 350.00,
    createdAt: '2024-03-06T12:00:00Z',
    customer: { firstName: 'Sarah', lastName: 'Brown', email: 'sarah.b@example.com' },
  },
  {
    id: 'ord_1007',
    orderNumber: 'ORD-2024-0007',
    status: 'PENDING',
    paymentStatus: 'FAILED',
    totalAmount: 75.00,
    createdAt: '2024-03-05T16:20:00Z',
    customer: { firstName: 'Michael', lastName: 'Davis', email: 'm.davis@example.com' },
  },
  {
    id: 'ord_1008',
    orderNumber: 'ORD-2024-0008',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    totalAmount: 99.99,
    createdAt: '2024-03-04T10:00:00Z',
    customer: null, // Guest checkout example
  },
];