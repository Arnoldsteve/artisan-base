"use client";

import React, { useState, useMemo } from "react";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Order } from "@/types/orders";
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
import {
  useOrders,
  useDeleteOrder,
  useBatchDeleteOrders,
} from "@/hooks/use-orders";
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

interface OrdersViewProps {
  initialOrderData: PaginatedResponse<Order>;
}

export function OrdersView({ initialOrderData }: OrdersViewProps) {
  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
    isFetching,
  } = useOrders(pageIndex + 1, pageSize, "", initialOrderData);

  // console.log("Order data from product view: ", paginatedResponse);

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

  const table = useReactTable({
    data: orders,
    columns,
    pageCount:
      paginatedResponse?.meta?.totalPages ??
      (totalOrders > 0 ? Math.ceil(totalOrders / pageSize) : 1),
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
  if (isFetching || (isLoading && !initialOrderData)) {
    return <DataTableSkeleton />;
  }
  if (isError) {
    return <div className="p-8 text-red-500">Failed to load order data.</div>;
  }

  return (
    <>
      <PageHeader title="Orders">
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
