"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns, CustomerColumn } from "./columns";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import {
  Customer,
  UpdateCustomerDto,
  CreateCustomerDto,
} from "@/types/customers";
import {
  useCustomers,
  useDeleteCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/use-customers";

// UI Components
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { EditCustomerSheet } from "./edit-customer-sheet";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { CustomerFormData } from "@/validation-schemas/customers";
import { PaginatedResponse } from "@/types/shared";
import { CustomerTableMeta } from "@/types/table-meta";

interface CustomersViewProps {
  initialCustomerData: PaginatedResponse<Customer>;
}

export function CustomersView({ initialCustomerData }: CustomersViewProps) {
  const router = useRouter();

  // --- Component State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [customerToDelete, setCustomerToDelete] =
    useState<CustomerColumn | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- Data Fetching & Mutations ---
  const {
    data: paginatedResponse,
    isLoading,
    isError,
    isFetching,
  } = useCustomers(pageIndex + 1, pageSize, "", initialCustomerData);

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  // --- Data Transformation (Mapper) ---
  const mappedCustomers = useMemo(() => {
    const apiCustomers = paginatedResponse?.data || [];
    return apiCustomers.map(
      (customer: Customer): CustomerColumn => ({
        id: customer.id,
        name:
          `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
          customer.email,
        email: customer.email,
        phone: customer.phone || "",
        orderCount: (customer as any)._count?.orders ?? 0,
        totalSpent: parseFloat((customer as any).totalSpent) || 0,
        createdAt: new Date(customer.createdAt).toLocaleDateString(),
      })
    );
  }, [paginatedResponse]);

  const totalCustomers = paginatedResponse?.meta?.total || 0;

  // Helper to find the original customer object from the API response
  const findOriginalCustomer = (id: string): Customer | undefined => {
    return paginatedResponse?.data.find((c) => c.id === id);
  };

  // --- Action Handlers ---
  const openDeleteDialog = (customer: CustomerColumn) =>
    setCustomerToDelete(customer);
  const viewCustomerDetails = (customer: CustomerColumn) =>
    router.push(`/customers/${customer.id}`);
  const openEditSheet = (customerRow: CustomerColumn) => {
    const originalCustomer = findOriginalCustomer(customerRow.id);
    if (originalCustomer) {
      setCustomerToEdit(originalCustomer);
      setIsSheetOpen(true);
    }
  };

  // --- Create the meta object with proper typing ---
  const tableMeta: CustomerTableMeta<CustomerColumn> = {
    openDeleteDialog,
    viewCustomerDetails,
    openEditSheet,
  };

  // --- Table Instance Initialization ---
  const table = useReactTable({
    data: mappedCustomers,
    columns,
    pageCount:
      paginatedResponse?.meta?.totalPages ??
      (totalCustomers > 0 ? Math.ceil(totalCustomers / pageSize) : 1),
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: tableMeta,
  });

  // --- Event Handlers ---
  const openAddSheet = () => {
    setCustomerToEdit(null);
    setIsSheetOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id, {
        onSuccess: () => setCustomerToDelete(null),
      });
    }
  };

  const handleSaveChanges = (formData: CustomerFormData) => {
    if (formData.id) {
      const { id, ...updateData } = formData;
      updateCustomer(
        { id: id, data: updateData },
        {
          onSuccess: () => setIsSheetOpen(false),
        }
      );
    } else {
      createCustomer(formData as CreateCustomerDto, {
        onSuccess: () => setIsSheetOpen(false),
      });
    }
  };

  // --- Render Logic ---
  if ( isFetching|| (isLoading && !paginatedResponse)) {
    return <DataTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">Failed to load customer data.</div>
    );
  }

  const numSelected = Object.keys(rowSelection).length;

  return (
    <div>
      <PageHeader
        title="Customers"
      >
        <Button onClick={openAddSheet} disabled={isCreating || isUpdating}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </PageHeader>

      <div className="flex items-center py-4">
        <DataTableViewOptions table={table} />
      </div>

      <DataTable table={table} totalCount={totalCustomers} />

      <div
        className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out ${numSelected > 0 ? "translate-y-0" : "translate-y-24"}`}
      >
        {/* Bulk action bar would go here */}
      </div>

      <DeleteCustomerDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        customerName={customerToDelete?.name || ""}
        isPending={isDeleting}
      />
      <EditCustomerSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        customer={customerToEdit}
        onSave={handleSaveChanges}
        isPending={isCreating || isUpdating}
      />
    </div>
  );
}
