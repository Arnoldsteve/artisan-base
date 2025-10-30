
import { PageHeader } from "@/components/shared/page-header";

import { Plan, Subscription, Invoice } from "@/types/billing";
import { BillingCurrentPlan } from "../billing/components/billing-current-plan";
import { BillingPlanOptions } from "../billing/components/billing-plan-options";
import { BillingInvoiceHistory } from "../billing/components/billing-invoice-history";


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
