// src/lib/mock-data/orders.ts

import { Order } from "@/types/orders";

export const mockOrders: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: 'ORD-2024-0001',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    totalAmount: 159.99,
    subtotal: 149.99,
    taxAmount: 10.00,
    shippingAmount: 0.00,
    createdAt: '2024-03-10T10:00:00Z',
    customer: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    shippingAddress: { firstName: 'John', lastName: 'Doe', addressLine1: '123 Main St', city: 'Anytown', state: 'CA', postalCode: '12345', country: 'USA' },
    billingAddress: { firstName: 'John', lastName: 'Doe', addressLine1: '123 Main St', city: 'Anytown', state: 'CA', postalCode: '12345', country: 'USA' },
    items: [
      { id: 'item_1', productName: 'Ergonomic Office Chair', quantity: 1, unitPrice: 149.99, image: 'https://picsum.photos/seed/chair/100' },
    ],
  },
  {
    id: 'ord_1002',
    orderNumber: 'ORD-2024-0002',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    totalAmount: 99.50,
    subtotal: 89.50,
    taxAmount: 5.00,
    shippingAmount: 5.00,
    createdAt: '2024-03-09T14:30:00Z',
    customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    shippingAddress: { firstName: 'Jane', lastName: 'Smith', addressLine1: '456 Oak Ave', city: 'Someville', state: 'NY', postalCode: '54321', country: 'USA' },
    billingAddress: { firstName: 'Jane', lastName: 'Smith', addressLine1: '456 Oak Ave', city: 'Someville', state: 'NY', postalCode: '54321', country: 'USA' },
    items: [
      { id: 'item_2', productName: 'Wireless Mechanical Keyboard', quantity: 1, unitPrice: 89.50, image: 'https://picsum.photos/seed/keyboard/100' },
    ],
  },
  {
    id: 'ord_1003',
    orderNumber: 'ORD-2024-0003',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    totalAmount: 220.00,
    subtotal: 210.00,
    taxAmount: 10.00,
    shippingAmount: 0.00,
    createdAt: '2024-03-09T09:15:00Z',
    customer: { firstName: 'Peter', lastName: 'Jones', email: 'peter.jones@example.com' },
    shippingAddress: { firstName: 'Peter', lastName: 'Jones', addressLine1: '789 Pine Ln', city: 'Metropolis', state: 'TX', postalCode: '67890', country: 'USA' },
    billingAddress: { firstName: 'Peter', lastName: 'Jones', addressLine1: '789 Pine Ln', city: 'Metropolis', state: 'TX', postalCode: '67890', country: 'USA' },
    items: [
      { id: 'item_3a', productName: 'Premium Leather Mousepad', quantity: 2, unitPrice: 45.00, image: 'https://picsum.photos/seed/mousepad/100' },
      { id: 'item_3b', productName: '4K Ultra-Wide Monitor', quantity: 1, unitPrice: 120.00, image: 'https://picsum.photos/seed/monitor/100' },
    ],
  },
  // Add more detailed mock orders as needed...
  {
    id: 'ord_1008',
    orderNumber: 'ORD-2024-0008',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    totalAmount: 99.99,
    subtotal: 99.99,
    taxAmount: 0.00,
    shippingAmount: 0.00,
    createdAt: '2024-03-04T10:00:00Z',
    customer: null,
    shippingAddress: { firstName: 'Guest', lastName: 'User', addressLine1: '101 Guest Rd', city: 'Anonville', state: 'FL', postalCode: '11223', country: 'USA' },
    billingAddress: { firstName: 'Guest', lastName: 'User', addressLine1: '101 Guest Rd', city: 'Anonville', state: 'FL', postalCode: '11223', country: 'USA' },
    items: [
      { id: 'item_4', productName: 'Standing Desk Converter', quantity: 1, unitPrice: 99.99, image: 'https://picsum.photos/seed/desk/100' },
    ]
  },
];