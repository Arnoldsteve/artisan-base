export interface ProductImage {
  id: string;
  url: string;
  path: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: ProductImage[];
  category: Category;
  categoryId: string;
  rating: number;
  reviewCount: number;
  inventoryQuantity: number;
  sku: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  products?: Product[];
  _count?: {
    products: number;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tags?: string[];
  search?: string;
  sortBy?: "name" | "price" | "rating" | "createdAt" | "price-low" | "price-high";
  sortOrder?: "asc" | "desc";
}

export interface ProductSearchParams extends ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: ProductFilters["sortBy"];
  sortOrder?: "asc" | "desc";
}

// OPTIMIZATION: Union types for better type safety and performance
export type SortField = "name" | "price" | "rating" | "createdAt";
export type SortOrder = "asc" | "desc";
export type ProductStatus = "active" | "inactive" | "out_of_stock";
