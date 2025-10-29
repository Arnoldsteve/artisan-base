import { Table } from "@tanstack/react-table";

export interface ProductTableMeta<TData = any> {
  openDeleteDialog: (product: TData) => void;
  openEditSheet: (product: TData) => void;
  handleDuplicateProduct: (product: TData) => void;
  handleImageUpload: (product: TData) => void;
  handleCategoryChange: (product: TData) => void;
  openImagePreview: (product: TData) => void;
  // isFetching?: boolean;
}

export interface CategoryTableMeta<TData = any> {
  openDeleteDialog: (category: TData) => void;
  openEditSheet: (category: TData) => void;
  // viewCategoryProducts?: (category: TData) => void;
}

export interface CustomerTableMeta<TData = any> {
  viewCustomerDetails: (customer: TData) => void;
  openDeleteDialog: (customer: TData) => void;
  openEditSheet: (customer: TData) => void;
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
  openEditSheet: (dashboardUser: TData) => void;
  // Add other user management actions as needed
  // handleUserUpdated?: (user: TData) => void;
  // handleUserRoleChanged?: (userId: string, role: string) => void;
}

export type TableWithMeta<TData, TMeta> = Table<TData> & {
  options: {
    meta?: TMeta;
  };
};
