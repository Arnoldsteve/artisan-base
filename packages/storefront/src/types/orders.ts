// src/types/orders.ts

export interface Order {
  id: string; // internal unique ID
  orderNumber?: string; // human-friendly order number (e.g. #1001)
  totalAmount: number;
  currency: string;
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "unpaid" | "paid" | "refunded";
  estimatedDelivery?: string;

  // Optional details
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
