import React from "react";
import { TeamMembersView } from "../components/team-members-view";
import { TeamMember } from "@/types/team";

interface TeamMembersProps {
  teamMembers: TeamMember[];
}

export default function page( { teamMembers }: TeamMembersProps) {
  return (
    <TeamMembersView
      initialUsers={(teamMembers ?? []).map((m) => ({
        id: m.id,
        name: `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.email,
        email: m.email,
        role: m.role,
        isActive: m.isActive,
        createdAt: m.createdAt,
        avatarUrl: m.avatarUrl ?? undefined,
      }))}
    />
  );
}
