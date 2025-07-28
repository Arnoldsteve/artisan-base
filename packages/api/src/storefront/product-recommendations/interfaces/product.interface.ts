// File: packages/api/src/storefront/product-recommendations/interfaces/product.interface.ts

// A local definition of a Category
export interface Category {
  id: string;
  name: string;
}

// A local definition of a Product. This module will use this blueprint.
export interface Product {
  id: string;
  name: string;
  price: number;
  inventoryQuantity: number;
  categories?: Category[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}