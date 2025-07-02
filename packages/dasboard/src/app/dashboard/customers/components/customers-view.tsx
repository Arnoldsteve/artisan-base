"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/shared/data-table";
import { columns, CustomerColumn } from "./columns";
import { toast } from "sonner";
import { Button } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";
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
import { Customer } from "@/types/customers";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { EditCustomerSheet } from "./edit-customer-sheet";
import { DataTableViewOptions } from "@/app/dashboard/products/components/data-table-view-options";
import { useCustomers } from "@/hooks/use-customers";

interface CustomersViewProps {
  initialCustomers: CustomerColumn[];
}

export function CustomersView({ initialCustomers }: CustomersViewProps) {
  const router = useRouter();

  const {
    customers,
    loading,
    error,
    refreshCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setCustomers,
  } = useCustomers(initialCustomers);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [customerToDelete, setCustomerToDelete] =
    useState<CustomerColumn | null>(null);
  const [customerToEdit, setCustomerToEdit] =
    useState<Partial<Customer> | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isSavePending, setIsSavePending] = useState(false);

  const selectedCustomerIds = useMemo(() => {
    const selectedRows = Object.keys(rowSelection).map(
      (index) => customers[parseInt(index, 10)]
    );
    return selectedRows.filter(Boolean).map((row) => row.id);
  }, [rowSelection, customers]);
  const numSelected = selectedCustomerIds.length;

  const openDeleteDialog = (customer: CustomerColumn) =>
    setCustomerToDelete(customer);
  const viewCustomerDetails = (customer: CustomerColumn) =>
    router.push(`/dashboard/customers/${customer.id}`);

  const openEditSheet = (customer: CustomerColumn) => {
    setCustomerToEdit(customer);
    setIsSheetOpen(true);
  };

  const openAddSheet = () => {
    setCustomerToEdit(null);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setCustomerToEdit(null);
    setIsSheetOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setIsDeletePending(true);
    try {
      await deleteCustomer(customerToDelete.id);
      toast.success(`Customer "${customerToDelete.name}" has been deleted.`);
    } catch (error) {
      toast.error("Failed to delete customer.");
    } finally {
      setIsDeletePending(false);
      setCustomerToDelete(null);
    }
  };

  const handleSaveChanges = async (formData: Partial<Customer>) => {
    setIsSavePending(true);
    try {
      const name =
        `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
      const dataToSave = { ...formData, name };

      if (dataToSave.id) {
        const updatedCustomer = await updateCustomer(dataToSave.id, dataToSave);
        setCustomers((current) =>
          current.map((c) =>
            c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c
          )
        );
        toast.success(`Customer "${updatedCustomer.name}" updated.`);
      } else {
        const newCustomer = await createCustomer(dataToSave);
        setCustomers((current) => [newCustomer as CustomerColumn, ...current]);
        toast.success(`Customer "${newCustomer.name}" created.`);
      }
      closeSheet();
    } catch (error) {
      toast.error("Failed to save customer.");
    } finally {
      setIsSavePending(false);
    }
  };

  const table = useReactTable({
    data: customers,
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
    meta: {
      openDeleteDialog,
      viewCustomerDetails,
      openEditSheet,
    },
  });

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your customers."
      >
        <Button onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </PageHeader>
      <div className="flex items-center py-4">
        <DataTableViewOptions table={table} />
      </div>
      <DataTable table={table} />

      <div
        className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out ${numSelected > 0 ? "translate-y-0" : "translate-y-24"}`}
      >
        {numSelected > 0 && (
          <div className="mx-auto flex h-14 w-fit max-w-full items-center justify-between gap-8 rounded-full border bg-background/95 px-6 shadow-2xl backdrop-blur-sm">
            <div className="text-sm font-medium">
              <span className="font-semibold">{numSelected}</span> selected
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm" /* onClick={() => setIsBulkDeleteDialogOpen(true)} */
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowSelection({})}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <DeleteCustomerDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        customerName={customerToDelete?.name || ""}
        isPending={isDeletePending}
      />
      <EditCustomerSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        customer={customerToEdit}
        onSave={handleSaveChanges}
        isPending={isSavePending}
      />
    </div>
  );
}
