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
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { Customer, PaginatedResponse, UpdateCustomerDto } from "@/types/customers";
import {
  useCustomers,
  useDeleteCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/use-customers";

// UI Components
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { EditCustomerSheet } from "./edit-customer-sheet";
import { DataTableViewOptions } from "@/app/dashboard/products/components/data-table-view-options";
import { Button } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";

interface CustomersViewProps {
  initialData: PaginatedResponse<Customer>;
}

export function CustomersView({ initialData }: CustomersViewProps) {
  const router = useRouter();

  // --- Component State ---
  // State for the table's UI (sorting, filtering, etc.)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // State for controlling modals and dialogs
  const [customerToDelete, setCustomerToDelete] = useState<CustomerColumn | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Partial<CustomerColumn> | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- Data Fetching & Mutations with TanStack Query ---
  const { data: paginatedResponse, isLoading, isError } = useCustomers(1, 10, "", initialData);
  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  // --- CRITICAL: Data Transformation (The Mapper) ---
  // This memoized function transforms the raw API data (`Customer`) into the
  // shape that the table columns expect (`CustomerColumn`).
  const mappedCustomers = useMemo(() => {
    const apiCustomers = paginatedResponse?.data || [];
    return apiCustomers.map((customer: Customer): CustomerColumn => ({
      id: customer.id,
      name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email,
      email: customer.email,
      orderCount: 0, // Placeholder - API doesn't provide this yet
      totalSpent: 0, // Placeholder - API doesn't provide this yet
      createdAt: new Date(customer.createdAt).toLocaleDateString(),
    }));
  }, [paginatedResponse]);

  // --- Table Instance Initialization ---
  const table = useReactTable({
    data: mappedCustomers, // Use the correctly shaped data
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Pass action handlers to the table meta so they can be called from columns.tsx
    meta: {
      openDeleteDialog: (customer) => setCustomerToDelete(customer as CustomerColumn),
      viewCustomerDetails: (customer) => router.push(`/dashboard/customers/${customer.id}`),
      openEditSheet: (customer) => {
        setCustomerToEdit(customer as CustomerColumn);
        setIsSheetOpen(true);
      },
    },
  });
  
  // --- Event Handlers ---
  const openAddSheet = () => {
    setCustomerToEdit(null);
    setIsSheetOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id, {
        onSuccess: () => setCustomerToDelete(null), // Close dialog on success
      });
    }
  };

  const handleSaveChanges = (formData: UpdateCustomerDto & { id?: string }) => {
    if (formData.id) {
      updateCustomer({ id: formData.id, data: formData }, {
        onSuccess: () => setIsSheetOpen(false), // Close sheet on success
      });
    } else {
      createCustomer(formData, {
        onSuccess: () => setIsSheetOpen(false), // Close sheet on success
      });
    }
  };
  
  // --- Render Logic ---
  if (isLoading && !paginatedResponse) {
    return <DataTableSkeleton />; // Show a skeleton loader on hard reloads
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load customer data.</div>;
  }
  
  const selectedCustomerIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
  const numSelected = selectedCustomerIds.length;

  return (
    <div>
      <PageHeader title="Customers" description="View and manage your customers.">
        <Button onClick={openAddSheet} disabled={isCreating || isUpdating}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </PageHeader>
      
      <div className="flex items-center py-4">
        <DataTableViewOptions table={table} />
      </div>

      <DataTable table={table} />

      <div className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out ${numSelected > 0 ? "translate-y-0" : "translate-y-24"}`}>
        {/* Bulk Action Bar logic... */}
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