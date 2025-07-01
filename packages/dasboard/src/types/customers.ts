// The structure for a Customer Address object.
// This matches the `customer_addresses` table and can be included in customer data.
export interface CustomerAddress {
  id: string;
  type: string; // e.g., 'shipping', 'billing'
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// The structure for a simplified Order object, useful for order history previews.
export interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  totalAmount: number; // Prisma's Decimal becomes number
  createdAt: string; // Or Date
}

// The main Customer type, matching your Prisma schema for the `customers` table.
export interface Customer {
  id:string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  createdAt: string; // Or Date, depending on serialization
  updatedAt: string; // Or Date
  
  // Optional relations that can be included in API responses
  addresses?: CustomerAddress[];
  orders?: CustomerOrder[];
}

// A specific type for the customer detail page, ensuring all necessary data is present.
export interface CustomerDetails extends Customer {
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  // You could add aggregated stats here as well
  _stats?: {
    totalSpent: number;
    orderCount: number;
  };
}