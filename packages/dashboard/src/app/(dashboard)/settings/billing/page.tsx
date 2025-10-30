// src/app/(dashboard)/settings/billing/page.tsx

import { createServerApiClient } from "@/lib/server-api";
import { PageHeader } from "@/components/shared/page-header";
import { BillingCurrentPlan } from "./components/billing-current-plan";
import { BillingPlanOptions } from "./components/billing-plan-options";
import { BillingInvoiceHistory } from "./components/billing-invoice-history";

export default async function BillingPage() {
  const api = await createServerApiClient();

  const [plansRes, subscriptionRes, invoicesRes] = await Promise.all([
    api.get<{ data: any[] }>("/platform/plans"),
    api.get<{ data: any }>("/billing/subscription"),
    api.get<{ data: any[] }>("/billing/invoices"),
  ]);

  const plans = plansRes.data || [];
  const subscription = subscriptionRes.data || null;
  const invoices = invoicesRes.data || [];

  // console.log("plans data from the plans", plans);
  // console.log("plans data from the subscription", subscription);
  // console.log("plans data from the invoices", invoices);

  return (
    <>
      <PageHeader title="Billing" />
      <div className="px-2 md:p-8 space-y-6">
        <BillingCurrentPlan subscription={subscription} />
        <BillingPlanOptions
          availablePlans={plans}
          currentPlanId={subscription?.plan?.id}
        />
        <BillingInvoiceHistory invoices={invoices} />
      </div>
    </>
  );
}
