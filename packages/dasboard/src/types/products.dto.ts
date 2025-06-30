// src/types/products.dto.ts
import { Product } from './products'; // The main Product type

/**
 * Data Transfer Object for creating a new product.
 * This must match the `CreateProductDto` in the NestJS API.
 */
export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku?: string;
  inventoryQuantity: number;
  isFeatured?: boolean;
}

/**
 * Data Transfer Object for updating an existing product.
 * Corresponds to `UpdateProductDto` on the backend.
 * All properties are optional.
 */
export type UpdateProductDto = Partial<CreateProductDto>;

/**
 * Type for the paginated response from the `getProducts` endpoint.
 */
export interface PaginatedProductsResponse {
    data: Product[];
    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    }
}