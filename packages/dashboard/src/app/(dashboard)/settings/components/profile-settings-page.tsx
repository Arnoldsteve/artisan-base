// "use client";

import { createServerApiClient } from "@/lib/server-api";
import { PageHeader } from "@/components/shared/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

// Main section components
import { TeamMembersView } from "./team-members-view";
import { ProfileInfoForm } from "./profile-info-form";
import { ChangePasswordForm } from "./change-password-form";
import { StoreDetailsForm } from "./store-details-form";
import { StoreDomainsForm } from "./store-domains-form";
import { StoreDangerZone } from "./store-danger-zone";
import { BillingCurrentPlan } from "./billing-current-plan";
import { BillingPlanOptions } from "./billing-plan-options";
import { BillingInvoiceHistory } from "./billing-invoice-history";

import { ProfileResponse, User } from "@/types/users";
import { Tenant } from "@/types/tenant";
import { Plan, Subscription, Invoice } from "@/types/billing";



// ------------------ StoreSettings ------------------
interface StoreSettingsProps {
  tenant: Tenant | null;
}

export function StoreSettings({ tenant }: StoreSettingsProps) {
  if (!tenant)
    return (
      <p className="text-muted-foreground">Could not load store information.</p>
    );

  return (
    <div className="px-8 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StoreDetailsForm initialData={{ name: tenant.name }} />
        <StoreDomainsForm
          initialData={{
            subdomain: tenant.subdomain,
            customDomain: tenant.customDomain || null,
          }}
        />
      </div>
      <StoreDangerZone storeName={tenant.name} />
    </div>
  );
}

// ------------------ BillingSettings ------------------
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
