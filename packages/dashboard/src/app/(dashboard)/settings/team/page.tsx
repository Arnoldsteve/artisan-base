import { createServerApiClient } from "@/lib/server-api";
import { PageHeader } from "@/components/shared/page-header";
import { TeamMembersView } from "../components/team-members-view";
import { TeamMember } from "@/types/team";

export default async function TeamPage() {
  const api = await createServerApiClient();

  try {
    const res = await api.get<{ data: TeamMember[] }>("/dashboard/team");
    const teamMembers = res.data || [];

    return (
      <div className="px-8 space-y-6">
        <PageHeader title="Team Members" />
        <TeamMembersView
          initialUsers={teamMembers.map((m) => ({
            id: m.id,
            name: `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.email,
            email: m.email,
            role: m.role,
            isActive: m.isActive,
            createdAt: m.createdAt,
            avatarUrl: m.avatarUrl ?? undefined,
          }))}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load team members:", error);
    return (
      <div className="px-8 space-y-6">
        <PageHeader title="Team Members" />
        <p className="text-muted-foreground">
          Could not load team members. Please try again later.
        </p>
      </div>
    );
  }
}
