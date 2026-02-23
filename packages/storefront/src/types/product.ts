import { Currency } from "./currency";
import { Category } from "./category";
import { Review } from "./review";

/**
 * SOLID Principle: Single Responsibility
 * This file defines the core Product entities for the Storefront.
 */

export interface ProductImage {
  id: string;
  url: string;
  path: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  inventoryQuantity: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  tenantId: string; // Critical for identifying the seller in a marketplace view
  name: string;
  slug: string;
  description?: string;
  sku: string;
  
  // Pricing logic
  price: number;
  currency: Currency;
  originalPrice?: number; // For "Sale" badges (KES 5000 -> KES 4500)
  
  // Stock & Status
  inventoryQuantity: number;
  isActive: boolean;
  
  // Media
  images: ProductImage[];
  
  // Relations (Eager loaded for performance)
  categories: Category[];
  variants: ProductVariant[];
  reviews?: Review[];
  
  // Aggregated Analytics (Pre-calculated by backend for scale)
  averageRating: number;
  reviewCount: number;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * In your DB, this is a Json field. 
 * On the frontend, we force it into this predictable structure.
 */
export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

// Optimized filter types for Marketplace Search
export type SortField = "name" | "price" | "rating" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sortBy?: SortField | "price-low" | "price-high";
  sortOrder?: SortOrder;
}