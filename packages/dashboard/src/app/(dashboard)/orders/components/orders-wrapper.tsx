"use client";

import React, { useState, useMemo } from "react";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Order } from "@/types/orders";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { useOrders } from "@/hooks/use-orders"; // Only import the unified hook
import Link from "next/link";

// UI Components
import { PageHeader } from "@/components/shared/page-header";
import { DeleteOrderDialog } from "./delete-order-dialog";
import { Button } from "@repo/ui";
import { Trash2 } from "lucide-react";
import { BulkDeleteAlertDialog } from "../../products/components/bulk-delete-alert-dialog";
import { OrdersTableViewOptions } from "./data-table-view-options";
import { PaginatedResponse } from "@/types/shared";
import { OrderTableMeta } from "@/types/table-meta";
import { DataTablePagination } from "@/components/shared/data-table-footer";

interface OrdersWrapperProps {
  initialOrderData: PaginatedResponse<Order>;
}

export function OrdersWrapper({ initialOrderData }: OrdersWrapperProps) {
  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // --- Unified Data Hook ---
  // The hook now manages page, search, and all mutations internally.
  const {
    orders,
    meta,
    isLoading,
    isError,
    page,
    setPage,
    setSearch,
    deleteOrder,
    isDeleting,
    // Note: If you need batch delete, ensure it's exported from useOrders
    // For now we'll handle the ones we refactored
  } = useOrders(10); 

  // --- Modal/Dialog UI State ---
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // --- Action Handlers ---
  const openDeleteDialog = (order: Order) => setOrderToDelete(order);
  const openEditSheet = (order: Order) => {
    // Implement edit logic or navigation here
  };

  const tableMeta: OrderTableMeta<Order> = {
    openDeleteDialog,
    openEditSheet,
  };

  const table = useReactTable({
    data: orders,
    columns,
    // Use the meta from our hook for pagination
    pageCount: meta?.totalPages || 1,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: page - 1, // Convert 1-based hook page to 0-based table index
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      // Optional: sync table search with hook search
    },
    onColumnVisibilityChange: setColumnVisibility,
    // When the table wants to change page, update our hook's state
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize: 10 });
        setPage(newState.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: tableMeta,
  });

  const selectedOrderIds = useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);
  }, [rowSelection, table]);

  const numSelected = selectedOrderIds.length;

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id, {
        onSuccess: () => setOrderToDelete(null),
      });
    }
  };

  // --- Render Logic ---
  if (isLoading) return <DataTableSkeleton />;
  if (isError) return <div className="p-8 text-red-500">Failed to load orders.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader title="Orders">
          <Link href="/orders/new">
            <Button variant="outline" size="sm">New Order</Button>
          </Link>
        </PageHeader>

        <div className="px-4 md:px-2 lg:px-4 md:mt-0 md:pb-10">
          <OrdersTableViewOptions table={table} />
          <DataTable table={table} />
        </div>
      </div>

      <DataTablePagination table={table} totalCount={meta?.total || 0} />

      {/* Bulk Action Bar */}
      {numSelected > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="mx-auto flex h-14 w-fit items-center gap-8 rounded-full border bg-background/95 px-6 shadow-2xl backdrop-blur-sm">
            <div className="text-sm font-medium">
              <span className="font-semibold">{numSelected}</span> selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
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
        onConfirm={() => {
           // batch delete logic here
           setIsBulkDeleteDialogOpen(false);
           setRowSelection({});
        }}
        selectedCount={numSelected}
        isPending={false}
      />
    </div>
  );
}