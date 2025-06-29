'use client';

import React, { useState, useMemo } from "react";
import { Order } from "@/types/orders";
import { columns } from "./columns";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@repo/ui";
import Link from 'next/link';
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { BulkDeleteAlertDialog } from "@/app/dashboard/products/components/bulk-delete-alert-dialog";
import { DeleteOrderDialog } from "./delete-order-dialog";

async function deleteOrderApi(orderId: string): Promise<{ success: boolean }> {
  console.log(`Deleting order with ID: ${orderId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

function OrdersTableViewOptions() {
    return <div className="py-4"></div>;
}

interface OrdersViewProps {
  initialOrders: Order[];
}

export function OrdersView({ initialOrders }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);

  const selectedOrderIds = useMemo(() => {
    const selectedRows = Object.keys(rowSelection).map(index => orders[parseInt(index, 10)]);
    return selectedRows.map(row => row.id);
  }, [rowSelection, orders]);
  const numSelected = selectedOrderIds.length;

  const openDeleteDialog = (order: Order) => setOrderToDelete(order);

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeletePending(true);
    await deleteOrderApi(orderToDelete.id);
    setOrders((current) => current.filter((o) => o.id !== orderToDelete.id));
    toast.success(`Order ${orderToDelete.orderNumber} has been deleted.`);
    setIsDeletePending(false);
    setOrderToDelete(null);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeletePending(true);
    await Promise.all(selectedOrderIds.map(id => deleteOrderApi(id)));
    setOrders(current => current.filter(o => !selectedOrderIds.includes(o.id)));
    toast.success(`${numSelected} order(s) deleted successfully.`);
    setRowSelection({});
    setIsBulkDeletePending(false);
    setIsBulkDeleteDialogOpen(false);
  };

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
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
    },
  });

  return (
    <div>
      <PageHeader title="Orders" description="View and manage all customer orders.">
        <Link href="/dashboard/orders/new">
          <Button>Create Order</Button>
        </Link>
      </PageHeader>
      
      <OrdersTableViewOptions />
      
      <DataTable table={table} />

      <div
        className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out ${numSelected > 0 ? 'translate-y-0' : 'translate-y-24'}`}
      >
        {numSelected > 0 && (
          <div className="mx-auto flex h-14 w-fit max-w-full items-center justify-between gap-8 rounded-full border bg-background/95 px-6 shadow-2xl backdrop-blur-sm">
            <div className="text-sm font-medium"><span className="font-semibold">{numSelected}</span> selected</div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <DeleteOrderDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDelete}
        orderNumber={orderToDelete?.orderNumber || ''}
        isPending={isDeletePending}
      />
      <BulkDeleteAlertDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        selectedCount={numSelected}
        isPending={isBulkDeletePending}
      />
    </div>
  );
}