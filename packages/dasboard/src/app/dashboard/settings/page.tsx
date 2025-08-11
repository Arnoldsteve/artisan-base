// File: packages/dasboard/src/app/dashboard/settings/page.tsx

import { createServerApiClient } from '@/lib/server-api';
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";

// Main section components
import { TeamMembersView } from "./components/team-members-view";
import { ProfileInfoForm } from './components/profile-info-form';
import { ChangePasswordForm } from './components/change-password-form';
import { StoreDetailsForm } from './components/store-details-form';
import { StoreDomainsForm } from './components/store-domains-form';
import { StoreDangerZone } from './components/store-danger-zone';
import { BillingCurrentPlan } from "./components/billing-current-plan";
import { BillingPlanOptions } from "./components/billing-plan-options";
import { BillingInvoiceHistory } from "./components/billing-invoice-history";

// Import the necessary types for our live data
import { ProfileResponse, User } from '@/types/users';
import { Tenant } from '@/types/tenant';
import { Plan, Subscription, Invoice } from '@/types/billing';
import { TeamMember } from '@/types/team';


// --- Refactored, Prop-driven Container Components ---

function ProfileSettings({ user }: { user: User | null }) {
  if (!user) return <p className="text-muted-foreground">Could not load profile information.</p>;
  return (
    <div className="space-y-6">
      <ProfileInfoForm initialData={user} />
      <ChangePasswordForm />
    </div>
  );
}

function StoreSettings({ tenant }: { tenant: Tenant | null }) {
  if (!tenant) return <p className="text-muted-foreground">Could not load store information.</p>;
  return (
    <div className="space-y-6">
      <StoreDetailsForm initialData={{ name: tenant.name }} />
      <StoreDomainsForm initialData={{ subdomain: tenant.subdomain, customDomain: tenant.customDomain || null }} />
      <StoreDangerZone storeName={tenant.name} />
    </div>
  );
}

function BillingSettings({ plans, subscription, invoices }: { plans: Plan[], subscription: Subscription | null, invoices: Invoice[] }) {
  // Pass the server-fetched data down as props. The components will prioritize these over their own hooks.
  return (
    <div className="space-y-6">
      <BillingCurrentPlan subscription={subscription || undefined} />
      <BillingPlanOptions availablePlans={plans} currentPlanId={subscription?.plan.id} />
      <BillingInvoiceHistory invoices={invoices} />
    </div>
  );
}


// --- Main Page Component ---
export default async function SettingsPage() {
  const serverApi = await createServerApiClient();

  // Initialize variables with default empty states for resilience
  let profileData: ProfileResponse | null = null;
  let plans: Plan[] = [];
  let subscription: Subscription | null = null;
  let invoices: Invoice[] = [];
  let teamMembers: TeamMember[] = [];

  try {
    // Fetch all required data in parallel using Promise.allSettled for resilience.
    // This ensures that if one API call fails, the others can still succeed.
    const results = await Promise.allSettled([
      serverApi.get<{ data: ProfileResponse }>('/auth/profile'),
      serverApi.get<{ data: Plan[] }>('/billing/plans'),
      serverApi.get<{ data: Subscription }>('/billing/subscription'),
      serverApi.get<{ data: Invoice[] }>('/billing/invoices'),
      serverApi.get<{ data: TeamMember[] }>('/dashboard/team'),
    ]);

    // Safely assign data from fulfilled promises
    if (results[0].status === 'fulfilled') profileData = results[0].value.data;
    if (results[1].status === 'fulfilled') plans = results[1].value.data;
    if (results[2].status === 'fulfilled') subscription = results[2].value.data;
    if (results[3].status === 'fulfilled') invoices = results[3].value.data;
    if (results[4].status === 'fulfilled') teamMembers = results[4].value.data;

  } catch (error) {
    console.error("Failed to fetch settings data on server:", error);
    // Data will remain in its default empty state, preventing page crashes.
  }

  // The active tenant is typically the first one in the organizations list
  const activeTenant = profileData?.organizations?.[0] || null;

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader title="Settings" description="Manage your account, store, and billing settings." />
      
      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileSettings user={profileData?.user || null} />
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <TeamMembersView initialUsers={teamMembers} />
        </TabsContent>
        <TabsContent value="store" className="mt-4">
          <StoreSettings tenant={activeTenant} />
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <BillingSettings plans={plans} subscription={subscription} invoices={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}