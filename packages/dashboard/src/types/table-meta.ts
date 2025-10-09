// types/table-meta.ts
import { Table } from "@tanstack/react-table";

// Define specific meta interfaces for each entity type

export interface ProductTableMeta<TData = any> {
  openDeleteDialog: (product: TData) => void;
  openEditSheet: (product: TData) => void;
  handleDuplicateProduct: (product: TData) => void;
  handleImageUpload: (product: TData) => void;
  handleCategoryChange: (product: TData) => void;
  openImagePreview: (product: TData) => void;
  isFetching?: boolean; 
}

export interface CategoryTableMeta<TData = any> {
  openDeleteDialog: (category: TData) => void;
  openEditSheet: (category: TData) => void;
  // Add other category-specific actions as needed
  // viewCategoryProducts?: (category: TData) => void;
}

export interface CustomerTableMeta<TData = any> {
  viewCustomerDetails: (customer: TData) => void;
  openDeleteDialog: (customer: TData) => void;
  openEditSheet: (customer: TData) => void;
  // Add other customer-specific actions
}

export interface OrderTableMeta<TData = any> {
//   viewOrderDetails: (order: TData) => void;
//   updateOrderStatus: (order: TData) => void;
  openDeleteDialog: (order: TData) => void;
  openEditSheet: (order: TData) => void;
  // Add other order-specific actions
}

export interface UserTableMeta<TData = any> {
  handleUserDeleted: (userId: string) => void;
  // Add other user management actions as needed
  // handleUserUpdated?: (user: TData) => void;
  // handleUserRoleChanged?: (userId: string, role: string) => void;
}

// Generic type for table with meta
export type TableWithMeta<TData, TMeta> = Table<TData> & {
  options: {
    meta?: TMeta;
  };
}