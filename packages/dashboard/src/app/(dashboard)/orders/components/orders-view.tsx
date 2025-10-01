"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Order } from "@/types/orders";
import { columns } from "./columns";
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
import {
  useOrders,
  useDeleteOrder,
  useBatchDeleteOrders,
} from "@/hooks/use-orders";

// UI Components
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { DeleteOrderDialog } from "./delete-order-dialog";
import { Button } from "@repo/ui";
import { Trash2 } from "lucide-react";
import { BulkDeleteAlertDialog } from "../../products/components/bulk-delete-alert-dialog";
import { OrdersTableViewOptions } from "./data-table-view-options";
import { PaginatedResponse } from "@/types/shared";
import { OrderTableMeta } from "@/types/table-meta";

interface OrdersViewProps {
  initialData: PaginatedResponse<Order>;
}

export function OrdersView({ initialData }: OrdersViewProps) {
  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // --- Modal/Dialog UI State ---
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // --- Data Fetching & Mutations with TanStack Query ---
  // We now use the single, powerful `useOrders` hook for data.
  const {
    data: paginatedResponse,
    isLoading,
    isError,
  } = useOrders(1, 10, "", initialData);
  // And the mutation hooks for actions.
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const { mutate: batchDeleteOrders, isPending: isBatchDeleting } =
    useBatchDeleteOrders();

  // --- Memoized Data ---
  const orders = useMemo(
    () => paginatedResponse?.data || [],
    [paginatedResponse]
  );
  const totalOrders = paginatedResponse?.meta?.total || 0;

  // --- Action Handlers ---
  const openDeleteDialog = (order: Order) => setOrderToDelete(order);
  const openEditSheet = (order: Order) => setOrderToEdit(order);

  // --- Create the meta object with proper typing ---
  const tableMeta: OrderTableMeta<Order> = {
    openDeleteDialog,
    openEditSheet,
  };

  // --- Table Instance Initialization ---
  const table = useReactTable({
    data: orders,
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
    meta: tableMeta, // Now properly typed
  });

  const selectedOrderIds = useMemo(() => {
    return table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);
  }, [rowSelection, table]);
  const numSelected = selectedOrderIds.length;

  // --- Event Handlers that call mutations ---
  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id, {
        onSuccess: () => setOrderToDelete(null), // Close dialog on success
      });
    }
  };

  const handleBulkDelete = () => {
    if (numSelected > 0) {
      batchDeleteOrders(selectedOrderIds, {
        onSuccess: () => {
          setRowSelection({}); // Clear selection
          setIsBulkDeleteDialogOpen(false);
        },
      });
    }
  };

  // --- Render Logic ---
  if (isLoading && !paginatedResponse) {
    return <DataTableSkeleton />;
  }
  if (isError) {
    return <div className="p-8 text-red-500">Failed to load order data.</div>;
  }

  return (
    <>
      <PageHeader
        title="Orders"
        description="View and manage all customer orders."
      >
        <Link href="/orders/new">
          <Button>Create Order</Button>
        </Link>
      </PageHeader>
      <div>
        <OrdersTableViewOptions table={table} />
        <DataTable table={table} totalCount={totalOrders} />

        {numSelected > 0 && (
          <div className="fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out translate-y-0">
            <div className="mx-auto flex h-14 w-fit max-w-full items-center justify-between gap-8 rounded-full border bg-background/95 px-6 shadow-2xl backdrop-blur-sm">
              <div className="text-sm font-medium">
                <span className="font-semibold">{numSelected}</span> selected
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                  disabled={isBatchDeleting}
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
          </div>
        )}

        <DeleteOrderDialog
          isOpen={!!orderToDelete}
          onClose={() => setOrderToDelete(null)}
          onConfirm={handleConfirmDelete}
          orderNumber={orderToDelete?.orderNumber || ""}
          isPending={isDeleting}
        />
        <BulkDeleteAlertDialog
          isOpen={isBulkDeleteDialogOpen}
          onClose={() => setIsBulkDeleteDialogOpen(false)}
          onConfirm={handleBulkDelete}
          selectedCount={numSelected}
          isPending={isBatchDeleting}
        />
      </div>
    </>
  );
}
