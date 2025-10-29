
import { PageHeader } from "@/components/shared/page-header";
import { BillingCurrentPlan } from "./billing-current-plan";
import { BillingPlanOptions } from "./billing-plan-options";
import { BillingInvoiceHistory } from "./billing-invoice-history";

import { Plan, Subscription, Invoice } from "@/types/billing";


interface BillingSettingsProps {
  plans: Plan[];
  subscription: Subscription | null;
  invoices: Invoice[];
}

export function BillingSettings({
  plans,
  subscription,
  invoices,
}: BillingSettingsProps) {
  return (
    <>
      <PageHeader title="Billing" />
      <div className="px-8 space-y-6">
        <BillingCurrentPlan subscription={subscription} />
        <BillingPlanOptions
          availablePlans={plans}
          currentPlanId={subscription?.plan.id}
        />
        <BillingInvoiceHistory invoices={invoices} />
      </div>
    </>
  );
}
