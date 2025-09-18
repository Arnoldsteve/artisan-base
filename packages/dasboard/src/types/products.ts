import { Decimal } from 'decimal.js';
import { Category } from './categories';

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  price: Decimal; // <-- CORRECT TYPE: Uses the imported Decimal class
  sku: string | null;
  inventoryQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  images: ProductImage[];
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  description?: string;
  price: number; // Stays as 'number'
  sku?: string;
  inventoryQuantity: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;


export interface AssignCategoriesToProductDto {
  categoryIds: string[];
}