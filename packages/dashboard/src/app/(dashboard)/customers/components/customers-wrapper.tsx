"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns, CustomerColumn } from "./columns";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { Customer, CreateCustomerDto } from "@/types/customers";
import { useCustomers } from "@/hooks/use-customers";

// UI Components
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { EditCustomerSheet } from "./edit-customer-sheet";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@repo/ui";
import { CustomerTableMeta } from "@/types/table-meta";
import { DataTablePagination } from "@/components/shared/data-table-footer";

export function CustomersWrapper() {
  const router = useRouter();

  // --- Unified Data Hook ---
  const {
    customers,
    meta,
    isLoading,
    isFetching,
    isError,
    page,
    setPage,
    setSearch,
    createCustomer,
    isCreating,
    updateCustomer,
    isUpdating,
    deleteCustomer,
    isDeleting,
  } = useCustomers(10);

  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ email: false });
  const [rowSelection, setRowSelection] = useState({});

  // --- Modal UI State ---
  const [customerToDelete, setCustomerToDelete] = useState<CustomerColumn | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- Data Transformation for display ---
  const mappedCustomers = useMemo(() => {
    return customers.map((customer: Customer): CustomerColumn => ({
      id: customer.id,
      name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.email,
      email: customer.email,
      phone: customer.phone || "",
      orderCount: (customer as any)._count?.orders ?? 0,
      totalSpent: parseFloat((customer as any).totalSpent) || 0,
      createdAt: new Date(customer.createdAt).toLocaleDateString(),
    }));
  }, [customers]);

  const tableMeta: CustomerTableMeta<CustomerColumn> = {
    openDeleteDialog: setCustomerToDelete,
    viewCustomerDetails: (c) => router.push(`/customers/${c.id}`),
    openEditSheet: (c) => {
      const original = customers.find((apiC) => apiC.id === c.id);
      if (original) {
        setCustomerToEdit(original);
        setIsSheetOpen(true);
      }
    },
  };

  const table = useReactTable({
    data: mappedCustomers,
    columns,
    pageCount: meta?.totalPages || 1,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex: page - 1, pageSize: 10 },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize: 10 });
        setPage(newState.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: tableMeta,
  });

  if (isLoading || isFetching) return <DataTableSkeleton />;
  if (isError) return <div className="p-8 text-red-500">Error loading customers.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader title="Customers">
          <Button variant="outline" size="sm" onClick={() => { setCustomerToEdit(null); setIsSheetOpen(true); }}>
            Add Customer
          </Button>
        </PageHeader>

        <div className="px-4 md:px-2 lg:px-4 md:pb-10">
          <DataTableViewOptions table={table} />
          <DataTable table={table} />
        </div>
      </div>
      
      <DataTablePagination table={table} totalCount={meta?.total || 0} />

      <DeleteCustomerDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => deleteCustomer(customerToDelete!.id, { onSuccess: () => setCustomerToDelete(null) })}
        customerName={customerToDelete?.name || ""}
        isPending={isDeleting}
      />
      
      <EditCustomerSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        customer={customerToEdit}
        onSave={(data) => {
          if (data.id) updateCustomer({ id: data.id, data }, { onSuccess: () => setIsSheetOpen(false) });
          else createCustomer(data as CreateCustomerDto, { onSuccess: () => setIsSheetOpen(false) });
        }}
        isPending={isCreating || isUpdating}
      />
    </div>
  );
}