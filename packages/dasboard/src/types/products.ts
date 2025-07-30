// File: packages/dasboard/src/types/products.ts

// CORRECT IMPORT: Import the Decimal class directly from the library.
// This keeps the frontend decoupled from the backend's Prisma client.
import { Decimal } from 'decimal.js';

// ============================================================================
// Main Entity Types (Data received from the API)
// ============================================================================

/**
 * The structure for an image object, as stored in the JSONB 'images' field.
 */
export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

/**
 * The main Product type. This should precisely match the shape of the
 * data returned from your NestJS API. Axios will deserialize the JSON
 * 'price' string into a Decimal object if configured correctly, or you
 * may need a reviver function. For type safety, we define it as Decimal.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: Decimal; // <-- CORRECT TYPE: Uses the imported Decimal class
  sku: string | null;
  inventoryQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Data Transfer Objects (DTOs) (Data sent to the API)
// ============================================================================

/**
 * Data Transfer Object for creating a new product.
 * Using 'number' for price is correct for sending JSON data.
 */
export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number; // Stays as 'number'
  sku?: string;
  inventoryQuantity: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

/**
 * Data Transfer Object for updating an existing product.
 */
export type UpdateProductDto = Partial<CreateProductDto>;

// ============================================================================
// API Response Types
// ============================================================================

/**
 * A generic type for paginated API responses.
 * Example: PaginatedResponse<Product>
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        prev: number | null;
        next: number | null;
    }
}