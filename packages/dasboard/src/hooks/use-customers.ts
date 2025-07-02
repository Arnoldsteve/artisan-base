import { useState, useCallback, useMemo } from "react";
import { Customer } from "@/types/customers";
import { CustomerService } from "@/services/customer-service";
import { toast } from "sonner";

export function useCustomers(initialCustomers: Customer[]) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getAll();
      setCustomers(result);
    } catch (err) {
      setError((err as Error).message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (data: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await CustomerService.create(data);
      setCustomers((current) => [newCustomer, ...current]);
      toast.success(`Customer "${newCustomer.email}" has been created.`);
      return newCustomer;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(
    async (id: string, data: Partial<Customer>) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await CustomerService.update(id, data);
        setCustomers((current) =>
          current.map((c) => (c.id === updated.id ? updated : c))
        );
        toast.success(`Customer "${updated.email}" has been updated.`);
        return updated;
      } catch (err) {
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCustomer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await CustomerService.delete(id);
      setCustomers((current) => current.filter((c) => c.id !== id));
      toast.success("Customer deleted.");
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      customers,
      loading,
      error,
      refreshCustomers,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      setCustomers,
    }),
    [
      customers,
      loading,
      error,
      refreshCustomers,
      createCustomer,
      updateCustomer,
      deleteCustomer,
    ]
  );
}
// REFACTOR: All customer list/CRUD business logic and state moved to hook for SRP, DRY, and testability.
