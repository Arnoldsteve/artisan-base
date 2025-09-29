'use client';

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { ProfileSettings } from "./components/profile-settings-page";
import { TeamMembersView } from "./components/team-members-view";
import { BillingSettings, StoreSettings } from "./components/profile-settings-page";

import { ProfileResponse, User } from "@/types/users";
import { Tenant } from "@/types/tenant";
import { Plan, Subscription, Invoice } from "@/types/billing";
import { TeamMember } from "@/types/team";

interface SettingsPageProps {
  profileData: ProfileResponse;
  plans: Plan[];
  subscription: Subscription | null;
  invoices: Invoice[];
  teamMembers: TeamMember[];
}

export default function SettingsPage({
  profileData,
  plans,
  subscription,
  invoices,
  teamMembers,
}: SettingsPageProps) {
  const activeTenant: Tenant | null = profileData?.organizations?.[0] ?? null;

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
            initialUsers={(teamMembers ?? []).map((m) => ({
              id: m.id,
              name: `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() || m.email,
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
