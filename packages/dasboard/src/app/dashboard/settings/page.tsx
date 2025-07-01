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

// Types and mock data
import { DashboardUserRole } from '@/types/shared';
import { mockUsers } from "@/lib/mock-data/users";

export type DashboardUserData = {
  id: string; name: string | null; email: string; role: DashboardUserRole;
  isActive: boolean; createdAt: string;
};

// --- Tab-specific container components ---

function ProfileSettings() {
  const currentUser = { firstName: "Arnold", lastName: "S.", email: "owner@artisanbase.com" };
  return (
    <div className="space-y-6"><ProfileInfoForm initialData={currentUser} /><ChangePasswordForm /></div>
  );
}

function StoreSettings() {
  const tenantData = { name: "Artisan Base", subdomain: "artisan-base", customDomain: null };
  return (
    <div className="space-y-6">
      <StoreDetailsForm initialData={tenantData} />
      <StoreDomainsForm initialData={tenantData} />
      <StoreDangerZone storeName={tenantData.name} />
    </div>
  );
}

function BillingSettings() {
  // Mock data that would come from your API / Stripe
  const availablePlans = [
    { id: 'plan_free', name: 'Hobby', price: 0, billingCycle: 'MONTHLY' as const, features: ['10 Products', '1 Team Member', 'Basic Analytics'] },
    { id: 'plan_pro', name: 'Pro', price: 49, billingCycle: 'MONTHLY' as const, features: ['Unlimited Products', '5 Team Members', 'Advanced Analytics', 'Custom Domain'] },
  ];
  const currentSubscription = {
    status: 'ACTIVE' as const,
    currentPeriodEnd: new Date('2025-05-20'),
    plan: availablePlans[1], // Currently on the "Pro" plan
  };
  const invoices = [
    { id: 'inv_1', date: new Date('2024-04-20'), amount: 49.00, status: 'PAID' as const },
    { id: 'inv_2', date: new Date('2024-03-20'), amount: 49.00, status: 'PAID' as const },
    { id: 'inv_3', date: new Date('2024-02-20'), amount: 49.00, status: 'PAID' as const },
  ];

  return (
    <div className="space-y-6">
      <BillingCurrentPlan subscription={currentSubscription} />
      <BillingPlanOptions availablePlans={availablePlans} currentPlanId={currentSubscription.plan.id} />
      <BillingInvoiceHistory invoices={invoices} />
    </div>
  );
}


// --- Main Page Component ---
export default function SettingsPage() {
  const teamMembers = mockUsers;

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

        <TabsContent value="profile" className="mt-4"><ProfileSettings /></TabsContent>
        <TabsContent value="team" className="mt-4"><TeamMembersView initialUsers={teamMembers} /></TabsContent>
        <TabsContent value="store" className="mt-4"><StoreSettings /></TabsContent>
        <TabsContent value="billing" className="mt-4"><BillingSettings /></TabsContent>
      </Tabs>
    </div>
  );
}