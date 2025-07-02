import { useState, useCallback, useMemo } from "react";
import { orderService } from "@/services/order-service";
import {
  Order,
  CreateOrderDto,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import { toast } from "sonner";

export function useOrders(initialOrders: Order[]) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getAll();
      setOrders(result);
    } catch (err) {
      setError((err as Error).message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await orderService.deleteOrder(id);
      setOrders((current) => current.filter((o) => o.id !== id));
      toast.success("Order deleted.");
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const batchDeleteOrders = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await orderService.batchDeleteOrders(ids);
      setOrders((current) => current.filter((o) => !ids.includes(o.id)));
      toast.success(`${ids.length} order(s) deleted successfully.`);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add more CRUD/status/payment handlers as needed

  return useMemo(
    () => ({
      orders,
      loading,
      error,
      refreshOrders,
      deleteOrder,
      batchDeleteOrders,
      setOrders,
    }),
    [orders, loading, error, refreshOrders, deleteOrder, batchDeleteOrders]
  );
}
// REFACTOR: All order list/CRUD/status/payment business logic and state moved to hook for SRP, DRY, and testability.
