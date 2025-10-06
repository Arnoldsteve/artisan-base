"use client";

import { createServerApiClient } from "@/lib/server-api";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";

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
import { TeamMember } from "@/types/team";

// ------------------ ProfileSettings ------------------
interface ProfileSettingsProps {
  user: User | null;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  if (!user)
    return (
      <p className="text-muted-foreground">
        Could not load profile information.
      </p>
    );

  return (
    <div className="grid grid-cols-2 gap-4">
      <ProfileInfoForm initialData={user} />
      <ChangePasswordForm />
    </div>
  );
}

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
    <div className="space-y-6">
      <BillingCurrentPlan subscription={subscription} />
      <BillingPlanOptions
        availablePlans={plans}
        currentPlanId={subscription?.plan.id}
      />
      <BillingInvoiceHistory invoices={invoices} />
    </div>
  );
}

// ------------------ Main SettingsPage ------------------
export default async function SettingsPage() {
  const serverApi = await createServerApiClient();

  // Default empty states
  let profileData: ProfileResponse = {} as ProfileResponse;
  let plans: Plan[] = [];
  let subscription: Subscription | null = null;
  let invoices: Invoice[] = [];
  let teamMembers: TeamMember[] = [];

  try {
    const results = await Promise.allSettled([
      serverApi.get<{ data: ProfileResponse }>("/auth/profile"),
      serverApi.get<{ data: Plan[] }>("/dashboard/billing/plans"),
      serverApi.get<{ data: Subscription }>("/dashboard/billing/subscription"),
      serverApi.get<{ data: Invoice[] }>("/dashboard/billing/invoices"),
      serverApi.get<{ data: TeamMember[] }>("/dashboard/team"),
    ]);

    if (results[0].status === "fulfilled") profileData = results[0].value.data;
    if (results[1].status === "fulfilled") plans = results[1].value.data;
    if (results[2].status === "fulfilled") subscription = results[2].value.data;
    if (results[3].status === "fulfilled") invoices = results[3].value.data;
    if (results[4].status === "fulfilled") teamMembers = results[4].value.data;
  } catch (error) {
    console.error("Failed to fetch settings data on server:", error);
  }

  const activeTenant = profileData?.organizations?.[0];

  return (
    <div className="p-4 md-p-8 lg-p-10">
      <PageHeader
        title="Settings"
        description="Manage your account, store, and billing settings."
      />

      <Tabs defaultValue="billing" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileSettings user={profileData?.user ?? null} />
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <TeamMembersView
            initialUsers={teamMembers.map((m) => ({
              id: m.id,
              name:
                `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.email,
              email: m.email,
              role: m.role,
              isActive: m.isActive,
              createdAt: m.createdAt,
              avatarUrl: m.avatarUrl ?? undefined,
            }))}
          />
        </TabsContent>

        <TabsContent value="store" className="mt-4">
          <StoreSettings tenant={activeTenant} />
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <BillingSettings
            plans={plans}
            subscription={subscription}
            invoices={invoices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
