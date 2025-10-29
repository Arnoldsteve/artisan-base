import { createServerApiClient } from "@/lib/server-api";
import { PageHeader } from "@/components/shared/page-header";
import { TeamMember } from "@/types/team";
import { TeamMembersView } from "./components/team-members-view";

export default async function TeamPage() {
  const api = await createServerApiClient();

  let teamMembers: TeamMember[] = [];

  try {
    const response = await api.get<{ data: TeamMember[] }>("/dashboard/users");
    teamMembers = response.data || [];
  } catch (error) {
    console.error("Failed to load team members:", error);
  }

  return (
    <>
        <PageHeader title="Team Members" />
      <div className="px-8 space-y-6">

        {teamMembers.length > 0 ? (
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
        ) : (
          <p className="text-muted-foreground">
            Could not load team members. Please try again later.

          </p>
        )}
      </div>
    </>
  );
}
