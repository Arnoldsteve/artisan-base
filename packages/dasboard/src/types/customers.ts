import { Decimal } from 'decimal.js';
import { Order } from './orders'; 
import { PaginatedResponse } from './shared';

// Re-export this for convenience in other files
// export type { PaginatedResponse };

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
  // The full `Order` type should be used for relations
  orders?: Order[]; 
}

/**
 * A specific type for the customer detail page, ensuring all necessary data is present.
 * This is the primary type fetched for the [customerId] page.
 */
export interface CustomerDetails extends Customer {
  addresses: CustomerAddress[];
  // --- 2. THIS IS THE FIX ---
  // The `orders` property is now an array of the full `Order` objects.
  orders: Order[];
  
  _stats?: {
    totalSpent: Decimal;
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