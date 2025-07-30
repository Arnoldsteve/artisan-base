// File: packages/dasboard/src/types/customers.ts

// Import Decimal, as monetary values from the API should be handled with precision.
import { Decimal } from 'decimal.js';
// We can reuse the PaginatedResponse from our products types.
// A better long-term solution is to move PaginatedResponse to a generic `types/api.ts` file.
import { PaginatedResponse } from './products';

// Re-export this so it's available from the customer types file.
export type { PaginatedResponse };

// ============================================================================
// Main Entity Types (Data received from the API)
// ============================================================================

/**
 * The structure for a Customer Address object, matching the `customer_addresses` table.
 */
export interface CustomerAddress {
  id: string;
  type: string; // e.g., 'shipping', 'billing'
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * A simplified Order object for a customer's order history.
 */
export interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  totalAmount: Decimal; // <-- CORRECT TYPE: Monetary values should be Decimal
  createdAt: string;    // ISO date string
}

/**
 * The main Customer type, matching your Prisma schema for the `customers` table.
 */
export interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  
  // Optional relations that can be included in API responses
  addresses?: CustomerAddress[];
  orders?: CustomerOrder[];
}

/**
 * A specific type for the customer detail page, ensuring all necessary data is present.
 */
export interface CustomerDetails extends Customer {
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  // Example of aggregated stats your API might provide
  _stats?: {
    totalSpent: Decimal; // <-- CORRECT TYPE: Monetary values should be Decimal
    orderCount: number;
  };
}

// ============================================================================
// Data Transfer Objects (DTOs) (Data sent to the API)
// ============================================================================

/**
 * Data Transfer Object for creating a new customer.
 */
export interface CreateCustomerDto {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Data Transfer Object for updating an existing customer.
 */
export type UpdateCustomerDto = Partial<CreateCustomerDto>;