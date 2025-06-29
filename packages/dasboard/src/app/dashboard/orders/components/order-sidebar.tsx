'use client';

import { useState } from "react";
import { Order, OrderStatus } from "@/types/orders";
import { OrderActions } from "./order-actions";
import { OrderSummaryCard } from "./order-summary-card";
import { UpdateStatusDialog } from "./update-status-dialog";
import { toast } from 'sonner';

// Mock API call should live here, with the component that uses it.
async function updateOrderStatusApi(orderId: string, newStatus: OrderStatus): Promise<{ success: boolean }> {
    console.log(`Updating order ${orderId} to status ${newStatus}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}

interface OrderSidebarProps {
    initialOrder: Order;
}

export function OrderSidebar({ initialOrder }: OrderSidebarProps) {
    // This component holds the state for the order data it displays
    const [order, setOrder] = useState<Order>(initialOrder);

    // State for the dialog
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isStatusUpdatePending, setIsStatusUpdatePending] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

    const handleSaveStatus = async () => {
        setIsStatusUpdatePending(true);
        const { success } = await updateOrderStatusApi(order.id, selectedStatus);
        
        if (success) {
            // Optimistically update the local state to re-render the summary card
            setOrder(prevOrder => ({ ...prevOrder, status: selectedStatus }));
            toast.success(`Order status updated to ${selectedStatus}.`);
        } else {
            toast.error("Failed to update order status.");
        }
        setIsStatusUpdatePending(false);
        setIsStatusDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* The OrderActions component receives the handler to open the dialog */}
            <OrderActions 
                orderId={order.id} 
                onUpdateStatusClick={() => setIsStatusDialogOpen(true)} 
            />
            
            {/* The summary card receives the stateful 'order' object */}
            <OrderSummaryCard order={order} />

            {/* The dialog is also controlled by state within this component */}
            <UpdateStatusDialog 
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                currentStatus={order.status}
                onStatusChange={setSelectedStatus}
                onSave={handleSaveStatus}
                isPending={isStatusUpdatePending}
            />
        </div>
    );
}