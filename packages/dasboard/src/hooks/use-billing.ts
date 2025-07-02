import { useState, useCallback, useMemo } from "react";
import { BillingService } from "@/services/billing-service";
import { Plan, Subscription, Invoice } from "@/types/billing";
import { toast } from "sonner";

export function useBilling() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [plans, subscription, invoices] = await Promise.all([
        BillingService.getPlans(),
        BillingService.getSubscription(),
        BillingService.getInvoices(),
      ]);
      setPlans(plans);
      setSubscription(subscription);
      setInvoices(invoices);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePlan = useCallback(async (planId: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await BillingService.changePlan(planId);
      setSubscription(updated);
      toast.success("Your plan has been updated successfully!");
    } catch (err) {
      setError((err as Error).message);
      toast.error("Failed to update plan.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadInvoice = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await BillingService.downloadInvoice(invoiceId);
      toast.info("Downloading invoice...");
    } catch (err) {
      setError((err as Error).message);
      toast.error("Failed to download invoice.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      plans,
      subscription,
      invoices,
      loading,
      error,
      fetchBillingData,
      changePlan,
      downloadInvoice,
    }),
    [
      plans,
      subscription,
      invoices,
      loading,
      error,
      fetchBillingData,
      changePlan,
      downloadInvoice,
    ]
  );
}
// REFACTOR: All billing business logic and state moved to hook for SRP, DRY, and testability.
